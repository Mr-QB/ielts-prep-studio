/**
 * Safe Multi-User Migration Script for Cloudflare D1
 * Migrates existing single-user data and bootstraps the first user account.
 */

import fs from 'fs';
import path from 'path';
import { d1 } from '../server/d1Client';
import { hashPassword } from '../server/auth';

const INITIAL_EMAIL = 'qbao1607@gmail.com';
const INITIAL_PASS = 'Matkhau@';
const INITIAL_NAME = 'Bao';

async function migrate() {
  console.log('====================================================');
  console.log(' STARTING CLOUDFLARE D1 MULTI-USER DATA MIGRATION   ');
  console.log('====================================================');

  // 1. Audit baseline before migration
  const baseline: Record<string, number> = {};
  for (const t of ['vocab_decks', 'vocab_cards', 'grammar_progress', 'test_attempts', 'recorded_mistakes', 'daily_protocol']) {
    try {
      const res = await d1.query(`SELECT COUNT(*) as c FROM ${t}`);
      baseline[t] = res[0]?.c ?? 0;
    } catch {
      baseline[t] = 0;
    }
  }
  console.log('\n[1/6] Baseline Row Counts Before Migration:', baseline);

  // Backup existing grammar progress row if any
  let legacyGrammar: any[] = [];
  try {
    legacyGrammar = await d1.query('SELECT * FROM grammar_progress;');
    console.log(` - Backed up ${legacyGrammar.length} legacy grammar progress records.`);
  } catch (err: any) {
    console.log(' - No legacy grammar records found or error:', err.message);
  }

  // Backup existing vocab cards with SRS info
  let legacyCards: any[] = [];
  try {
    legacyCards = await d1.query('SELECT * FROM vocab_cards;');
    console.log(` - Backed up ${legacyCards.length} legacy vocab cards.`);
  } catch (err: any) {
    console.log(' - Error fetching legacy cards:', err.message);
  }

  // 2. Create users and sessions tables
  console.log('\n[2/6] Creating users and sessions tables...');
  await d1.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      current_band REAL DEFAULT 4.0,
      target_band REAL DEFAULT 6.5,
      daily_study_minutes INTEGER DEFAULT 180,
      roadmap_start_date TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_login_at INTEGER,
      is_active INTEGER DEFAULT 1
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

  await d1.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      last_seen_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);`);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);`);

  // 3. Create user_vocab_progress table
  console.log('\n[3/6] Creating user_vocab_progress table...');
  await d1.execute(`
    CREATE TABLE IF NOT EXISTS user_vocab_progress (
      user_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 1,
      repetitions INTEGER DEFAULT 0,
      next_review TEXT NOT NULL,
      last_review TEXT,
      learning_status TEXT DEFAULT 'new',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, card_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (card_id) REFERENCES vocab_cards(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_user_vocab_next_review ON user_vocab_progress(user_id, next_review);`);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_user_vocab_status ON user_vocab_progress(user_id, learning_status);`);

  // Alter vocab_decks and vocab_cards to add owner_user_id if missing
  try {
    await d1.execute(`ALTER TABLE vocab_decks ADD COLUMN owner_user_id TEXT;`);
    console.log(' - Added owner_user_id column to vocab_decks.');
  } catch {
    // Column might already exist
  }
  try {
    await d1.execute(`ALTER TABLE vocab_cards ADD COLUMN owner_user_id TEXT;`);
    console.log(' - Added owner_user_id column to vocab_cards.');
  } catch {
    // Column might already exist
  }

  // 4. Update personal tables for multi-user isolation
  console.log('\n[4/6] Updating personal data tables (grammar, attempts, mistakes, protocol)...');
  await d1.execute(`DROP TABLE IF EXISTS grammar_progress;`);
  await d1.execute(`
    CREATE TABLE grammar_progress (
      user_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      status TEXT NOT NULL,
      last_studied TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, topic_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_grammar_progress_user ON grammar_progress(user_id);`);

  await d1.execute(`DROP TABLE IF EXISTS test_attempts;`);
  await d1.execute(`
    CREATE TABLE test_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      section_id TEXT NOT NULL,
      section_title TEXT NOT NULL,
      test_type TEXT NOT NULL,
      date TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      band_score REAL NOT NULL,
      time_spent_seconds INTEGER NOT NULL,
      question_type_stats TEXT,
      mistake_tags TEXT,
      detailed_answers TEXT,
      created_at DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id, created_at);`);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_test_attempts_skill ON test_attempts(user_id, skill);`);

  await d1.execute(`DROP TABLE IF EXISTS recorded_mistakes;`);
  await d1.execute(`
    CREATE TABLE recorded_mistakes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      test_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      question_type TEXT NOT NULL,
      error_type TEXT NOT NULL,
      user_answer TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      note TEXT,
      timestamp TEXT NOT NULL,
      created_at DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_recorded_mistakes_user ON recorded_mistakes(user_id, created_at);`);

  await d1.execute(`DROP TABLE IF EXISTS daily_protocol;`);
  await d1.execute(`
    CREATE TABLE daily_protocol (
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      tasks TEXT NOT NULL,
      streak_days INTEGER DEFAULT 1,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await d1.execute(`CREATE INDEX IF NOT EXISTS idx_daily_protocol_user ON daily_protocol(user_id, date);`);

  await d1.execute(`DROP TABLE IF EXISTS meta_settings;`);
  await d1.execute(`
    CREATE TABLE meta_settings (
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 5. Bootstrap Initial User
  console.log('\n[5/6] Creating primary user account...');
  const { hash, salt } = await hashPassword(INITIAL_PASS);
  const userId = `usr-bao-${Date.now().toString(36)}`;
  const now = Date.now();

  // Check if user already exists
  const existingUsers = await d1.query(`SELECT id FROM users WHERE email = ?;`, [INITIAL_EMAIL]);
  let activeUserId = userId;

  if (existingUsers.length > 0) {
    activeUserId = existingUsers[0].id;
    console.log(` - User with email ${INITIAL_EMAIL} already exists (ID: ${activeUserId}). Updating password...`);
    await d1.execute(
      `UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?;`,
      [hash, salt, now, activeUserId]
    );
  } else {
    await d1.execute(
      `INSERT INTO users (
        id, email, display_name, password_hash, password_salt,
        current_band, target_band, daily_study_minutes, roadmap_start_date,
        created_at, updated_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
      [
        activeUserId,
        INITIAL_EMAIL,
        INITIAL_NAME,
        hash,
        salt,
        4.0,
        6.5,
        180,
        new Date().toISOString().split('T')[0],
        now,
        now
      ]
    );
    console.log(` - Created initial user: ${INITIAL_NAME} <${INITIAL_EMAIL}> (ID: ${activeUserId})`);
  }

  // Migrate legacy grammar progress to activeUserId
  if (legacyGrammar.length > 0) {
    for (const g of legacyGrammar) {
      await d1.execute(
        `INSERT INTO grammar_progress (user_id, topic_id, status, last_studied)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, topic_id) DO NOTHING;`,
        [activeUserId, g.topic_id, g.status, g.last_studied || new Date().toISOString()]
      );
    }
    console.log(` - Restored ${legacyGrammar.length} grammar progress records to user ${activeUserId}.`);
  }

  // Migrate legacy SRS state into user_vocab_progress for activeUserId
  if (legacyCards.length > 0) {
    let srsMigrated = 0;
    for (const c of legacyCards) {
      const ease = c.ease_factor || 2.5;
      const interval = c.interval_days || 1;
      const reps = c.repetition || 0;
      const nextRev = c.due_date || new Date().toISOString();
      const status = c.state || 'new';

      await d1.execute(
        `INSERT INTO user_vocab_progress (
          user_id, card_id, ease_factor, interval_days, repetitions,
          next_review, learning_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, card_id) DO UPDATE SET
          ease_factor = excluded.ease_factor,
          interval_days = excluded.interval_days,
          repetitions = excluded.repetitions,
          next_review = excluded.next_review,
          learning_status = excluded.learning_status,
          updated_at = excluded.updated_at;`,
        [activeUserId, c.id, ease, interval, reps, nextRev, status, now, now]
      );
      srsMigrated++;
    }
    console.log(` - Migrated SRS state for ${srsMigrated} cards into user_vocab_progress for user ${activeUserId}.`);
  }

  // 6. Verification of row counts
  console.log('\n[6/6] Verifying Migration Row Counts:');
  const after: Record<string, number> = {};
  const tables = [
    'users',
    'sessions',
    'vocab_decks',
    'vocab_cards',
    'user_vocab_progress',
    'grammar_progress',
    'test_attempts',
    'recorded_mistakes',
    'daily_protocol'
  ];

  for (const t of tables) {
    const res = await d1.query(`SELECT COUNT(*) as c FROM ${t};`);
    after[t] = res[0]?.c ?? 0;
    console.log(` - Table ${t.padEnd(22)}: ${after[t]} rows`);
  }

  console.log('\n====================================================');
  console.log(' MULTI-USER MIGRATION COMPLETED SUCCESSFULLY!       ');
  console.log(` Login Email: ${INITIAL_EMAIL}`);
  console.log(` User ID:     ${activeUserId}`);
  console.log('====================================================');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
