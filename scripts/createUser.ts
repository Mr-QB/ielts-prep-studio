/**
 * CLI Tool for Creating User Accounts
 * Usage:
 *   npx tsx scripts/createUser.ts --email=user@test.com --name="Nguyen Van A" --password="Password123"
 * Or run interactively:
 *   npx tsx scripts/createUser.ts
 */

import readline from 'readline';
import { d1 } from '../server/d1Client';
import { hashPassword } from '../server/auth';

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        result[arg.substring(2, eqIdx)] = arg.substring(eqIdx + 1);
      } else {
        result[arg.substring(2)] = 'true';
      }
    }
  }
  return result;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function createUser(options?: {
  email?: string;
  name?: string;
  password?: string;
  currentBand?: number;
  targetBand?: number;
  studyMinutes?: number;
}) {
  const args = parseArgs();
  const email = (options?.email || args.email || (await prompt('Email: '))).toLowerCase().trim();
  const name = options?.name || args.name || (await prompt('Display Name: '));
  const password = options?.password || args.password || (await prompt('Password: '));
  const currentBand = Number(options?.currentBand || args.currentBand || 4.0);
  const targetBand = Number(options?.targetBand || args.targetBand || 6.5);
  const studyMinutes = Number(options?.studyMinutes || args.studyMinutes || 180);

  if (!email || !name || !password) {
    console.error('Error: Email, Display Name, and Password are all required.');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters.');
    process.exit(1);
  }

  // Check if user already exists
  const existing = await d1.query('SELECT id FROM users WHERE email = ?;', [email]);
  if (existing.length > 0) {
    console.error(`Error: User with email "${email}" already exists (ID: ${existing[0].id}).`);
    process.exit(1);
  }

  const { hash, salt } = await hashPassword(password);
  const userId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = Date.now();

  await d1.execute(
    `INSERT INTO users (
      id, email, display_name, password_hash, password_salt,
      current_band, target_band, daily_study_minutes, roadmap_start_date,
      created_at, updated_at, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
    [
      userId,
      email,
      name,
      hash,
      salt,
      currentBand,
      targetBand,
      studyMinutes,
      new Date().toISOString().split('T')[0],
      now,
      now
    ]
  );

  // Initialize starter vocab cards into user_vocab_progress for this new user
  const sharedCards = await d1.query<any>('SELECT id FROM vocab_cards WHERE owner_user_id IS NULL;');
  for (const card of sharedCards) {
    await d1.execute(
      `INSERT INTO user_vocab_progress (
        user_id, card_id, ease_factor, interval_days, repetitions,
        next_review, learning_status, created_at, updated_at
      ) VALUES (?, ?, 2.5, 1, 0, ?, 'new', ?, ?);`,
      [userId, card.id, new Date().toISOString(), now, now]
    );
  }

  console.log(`\n✓ User account created successfully!`);
  console.log(` - ID:           ${userId}`);
  console.log(` - Email:        ${email}`);
  console.log(` - Display Name: ${name}`);
  console.log(` - Target Band:  ${targetBand}`);
  console.log(` - Initial SRS cards initialized: ${sharedCards.length}`);

  return { id: userId, email, name };
}

if (process.argv[1]?.endsWith('createUser.ts')) {
  createUser().catch(err => {
    console.error('Create user failed:', err);
    process.exit(1);
  });
}
