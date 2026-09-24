/**
 * Production-ready Multi-Tenant API & Static Web Server for IELTS Prep Studio
 * Built with native Node.js HTTP (zero extra runtime dependencies)
 * Native Session Authentication with Cloudflare D1.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { d1 } from './d1Client';
import {
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  revokeSession,
  requireUser,
  buildSessionCookie,
  parseCookies,
  SESSION_COOKIE_NAME,
  User
} from './auth';
import type {
  VocabDeck,
  VocabCard,
  TestAttempt,
  RecordedMistake,
  GrammarProgressStatus,
  DailyProtocolRecord,
  VocabReviewLog
} from '../src/types';
import { lookupVocabularyWord } from './vocabLookup';

// Load .env if present
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const PORT = parseInt(process.env.PORT || '80', 10);
const DIST_DIR = path.resolve('dist');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Simple in-memory login rate limiter
const failedLoginAttempts: Record<string, { count: number; firstAttempt: number }> = {};
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const record = failedLoginAttempts[ip];
  if (!record) return false;
  if (Date.now() - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    delete failedLoginAttempts[ip];
    return false;
  }
  return record.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  if (!failedLoginAttempts[ip] || now - failedLoginAttempts[ip].firstAttempt > RATE_LIMIT_WINDOW_MS) {
    failedLoginAttempts[ip] = { count: 1, firstAttempt: now };
  } else {
    failedLoginAttempts[ip].count++;
  }
}

function resetFailedLogin(ip: string) {
  delete failedLoginAttempts[ip];
}

function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  data: any,
  headers: Record<string, string> = {}
) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(data));
}

function parseBody<T = any>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// -------------------------------------------------------------
// API ROUTE HANDLERS
// -------------------------------------------------------------

async function handleApiRoutes(req: http.IncomingMessage, res: http.ServerResponse, url: URL): Promise<boolean> {
  const pathname = url.pathname;
  const method = req.method || 'GET';
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // Security: Check origin on mutating state
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const origin = req.headers.origin || req.headers.referer;
    const host = req.headers.host;
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host && !originHost.startsWith('127.0.0.1') && !originHost.startsWith('localhost')) {
          sendJson(res, 403, { error: 'Forbidden: Invalid origin' });
          return true;
        }
      } catch {
        // ignore parsing
      }
    }
  }

  // 1. Health & Status (Public)
  if (pathname === '/api/health') {
    const d1Health = await d1.checkHealth();
    sendJson(res, 200, {
      status: 'ok',
      service: 'ielts-prep-studio-d1',
      timestamp: new Date().toISOString(),
      d1: d1Health
    });
    return true;
  }

  // 2. Authentication Routes
  if (pathname === '/api/auth/login' && method === 'POST') {
    if (isRateLimited(clientIp)) {
      sendJson(res, 429, { error: 'Too many failed login attempts. Please try again in 15 minutes.' });
      return true;
    }

    try {
      const body = await parseBody<{ email?: string; password?: string }>(req);
      const email = (body.email || '').toLowerCase().trim();
      const password = body.password || '';

      if (!email || !password) {
        sendJson(res, 400, { error: 'Email and password are required.' });
        return true;
      }

      const users = await d1.query<any>(
        `SELECT id, email, display_name, password_hash, password_salt, current_band,
                target_band, daily_study_minutes, roadmap_start_date, is_active
         FROM users WHERE email = ? LIMIT 1;`,
        [email]
      );

      if (users.length === 0 || users[0].is_active !== 1) {
        recordFailedLogin(clientIp);
        sendJson(res, 401, { error: 'Invalid email or password.' });
        return true;
      }

      const userRow = users[0];
      const valid = await verifyPassword(password, userRow.password_hash, userRow.password_salt);

      if (!valid) {
        recordFailedLogin(clientIp);
        sendJson(res, 401, { error: 'Invalid email or password.' });
        return true;
      }

      resetFailedLogin(clientIp);
      const { token } = await createSession(userRow.id);
      const cookieHeader = buildSessionCookie(token);

      sendJson(
        res,
        200,
        {
          success: true,
          user: {
            id: userRow.id,
            email: userRow.email,
            displayName: userRow.display_name,
            currentBand: userRow.current_band || 4.0,
            targetBand: userRow.target_band || 6.5,
            dailyStudyMinutes: userRow.daily_study_minutes || 180,
            roadmapStartDate: userRow.roadmap_start_date
          }
        },
        { 'Set-Cookie': cookieHeader }
      );
    } catch (err: any) {
      console.error('Login error:', err);
      sendJson(res, 500, { error: 'Internal login error' });
    }
    return true;
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE_NAME];
    if (token) {
      await revokeSession(token);
    }
    const cookieHeader = buildSessionCookie('', 0);
    sendJson(res, 200, { success: true }, { 'Set-Cookie': cookieHeader });
    return true;
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE_NAME];
    if (!token) {
      sendJson(res, 401, { error: 'Not authenticated' });
      return true;
    }

    const user = await validateSession(token);
    if (!user) {
      const cookieHeader = buildSessionCookie('', 0);
      sendJson(res, 401, { error: 'Session expired' }, { 'Set-Cookie': cookieHeader });
      return true;
    }

    sendJson(res, 200, {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        currentBand: user.currentBand,
        targetBand: user.targetBand,
        dailyStudyMinutes: user.dailyStudyMinutes,
        roadmapStartDate: user.roadmapStartDate
      }
    });
    return true;
  }

  if (pathname === '/api/auth/profile' && method === 'PUT') {
    try {
      const user = await requireUser(req);
      const body = await parseBody<{
        displayName?: string;
        currentBand?: number;
        targetBand?: number;
        dailyStudyMinutes?: number;
        roadmapStartDate?: string;
      }>(req);

      const name = body.displayName ? body.displayName.trim() : user.displayName;
      const curBand = body.currentBand !== undefined ? Number(body.currentBand) : user.currentBand;
      const tgtBand = body.targetBand !== undefined ? Number(body.targetBand) : user.targetBand;
      const studyMins = body.dailyStudyMinutes !== undefined ? Number(body.dailyStudyMinutes) : user.dailyStudyMinutes;
      const roadmapDate = body.roadmapStartDate || user.roadmapStartDate || new Date().toISOString().split('T')[0];
      const now = Date.now();

      await d1.execute(
        `UPDATE users
         SET display_name = ?, current_band = ?, target_band = ?, daily_study_minutes = ?,
             roadmap_start_date = ?, updated_at = ?
         WHERE id = ?;`,
        [name, curBand, tgtBand, studyMins, roadmapDate, now, user.id]
      );

      sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: name,
          currentBand: curBand,
          targetBand: tgtBand,
          dailyStudyMinutes: studyMins,
          roadmapStartDate: roadmapDate
        }
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      sendJson(res, statusCode, { error: err.message });
    }
    return true;
  }

  // Vocab Lookup API (Dictionary + Context + Vietnamese Suggestion) - open utility
  if (pathname === '/api/vocab/lookup' && method === 'GET') {
    try {
      const word = url.searchParams.get('word') || '';
      const context = url.searchParams.get('context') || '';
      if (!word) {
        sendJson(res, 400, { error: 'Word parameter is required' });
        return true;
      }
      const result = await lookupVocabularyWord(word, context);
      sendJson(res, 200, { success: true, ...result });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // -------------------------------------------------------------
  // ALL REMAINING ROUTES REQUIRE AUTHENTICATION
  // -------------------------------------------------------------
  let authenticatedUser: User;
  try {
    authenticatedUser = await requireUser(req);
  } catch (err: any) {
    sendJson(res, 401, { error: 'Authentication required' });
    return true;
  }

  const userId = authenticatedUser.id;

  if ((pathname === '/api/bootstrap' || pathname === '/api/sync/pull') && method === 'GET') {
    try {
      const requestedCursor = pathname === '/api/bootstrap' ? 0 : Math.max(0, Number(url.searchParams.get('cursor') || 0));
      const rows = await d1.query<any>(
        `SELECT cursor, change_id, entity, record_id, operation, payload, updated_at
         FROM sync_changes WHERE user_id = ? AND cursor > ? ORDER BY cursor ASC LIMIT 500;`,
        [userId, Number.isFinite(requestedCursor) ? requestedCursor : 0]
      );
      const changes = rows.map(row => ({
        cursor: row.cursor,
        changeId: row.change_id,
        userId,
        entity: row.entity,
        recordId: row.record_id,
        operation: row.operation,
        payload: row.payload ? JSON.parse(row.payload) : null,
        updatedAt: row.updated_at
      }));
      const nextCursor = changes.length ? changes[changes.length - 1].cursor : requestedCursor;
      sendJson(res, 200, { success: true, cursor: nextCursor, changes });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  if (pathname === '/api/sync/push' && method === 'POST') {
    try {
      const body = await parseBody<{ changes?: any[] }>(req);
      const changes = Array.isArray(body.changes) ? body.changes.slice(0, 200) : [];
      const allowedEntities = new Set(['decks', 'vocab_progress', 'vocab_review', 'attempt', 'mistake', 'grammar', 'protocol']);
      const acceptedIds: string[] = [];
      for (const change of changes) {
        if (!change || typeof change.id !== 'string' || typeof change.changeId !== 'string' ||
            !allowedEntities.has(change.entity) || typeof change.recordId !== 'string' ||
            !['upsert', 'delete'].includes(change.operation) || !Number.isFinite(change.updatedAt)) continue;
        const payload = change.operation === 'delete' ? null : JSON.stringify(change.payload ?? null);
        if (payload && payload.length > 1_000_000) continue;
        await d1.execute(
          `INSERT OR IGNORE INTO sync_changes (user_id, change_id, entity, record_id, operation, payload, updated_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [userId, change.changeId, change.entity, change.recordId, change.operation, payload, change.updatedAt, Date.now()]
        );
        acceptedIds.push(change.id);
      }
      const [latest] = await d1.query<any>('SELECT COALESCE(MAX(cursor), 0) AS cursor FROM sync_changes WHERE user_id = ?;', [userId]);
      sendJson(res, 200, { success: true, accepted: acceptedIds.length, acceptedIds, cursor: latest?.cursor || 0 });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 3. Vocabulary Decks & Cards (Merged with user_vocab_progress)
  if (pathname === '/api/decks') {
    if (method === 'GET') {
      try {
        // Load shared decks + user-owned personal decks
        const rawDecks = await d1.query<any>(
          `SELECT * FROM vocab_decks
           WHERE owner_user_id IS NULL OR owner_user_id = ?
           ORDER BY created_at ASC;`,
          [userId]
        );

        // Load shared cards + user-owned personal cards
        const rawCards = await d1.query<any>(
          `SELECT c.*, p.ease_factor, p.interval_days, p.repetitions, p.next_review, p.last_review, p.learning_status
           FROM vocab_cards c
           LEFT JOIN user_vocab_progress p ON (p.card_id = c.id AND p.user_id = ?)
           WHERE c.owner_user_id IS NULL OR c.owner_user_id = ?
           ORDER BY c.rowid ASC;`,
          [userId, userId]
        );

        // Group cards by deck_id
        const cardsByDeck: Record<string, VocabCard[]> = {};
        for (const c of rawCards) {
          if (!cardsByDeck[c.deck_id]) cardsByDeck[c.deck_id] = [];
          cardsByDeck[c.deck_id].push({
            id: c.id,
            word: c.word,
            phonetic: c.phonetic || '',
            partOfSpeech: c.part_of_speech || 'academic',
            definitionVi: c.definition_vi,
            definitionEn: c.definition_en || '',
            example: c.example || '',
            collocations: c.collocations ? JSON.parse(c.collocations) : [],
            category: c.category || '',
            source: c.source || '',
            sourceContext: c.source_context || '',
            repetition: c.repetitions ?? 0,
            intervalDays: c.interval_days ?? 1,
            easeFactor: c.ease_factor ?? 2.5,
            dueDate: c.next_review || new Date().toISOString(),
            lastReviewed: c.last_review || undefined,
            state: (c.learning_status || 'new') as any
          });
        }

        const decks: VocabDeck[] = rawDecks.map(d => ({
          id: d.id,
          name: d.name,
          description: d.description || '',
          createdAt: d.created_at,
          source: d.owner_user_id ? 'Personal Custom Deck' : 'Cambridge IELTS Core Reference',
          cards: cardsByDeck[d.id] || []
        }));

        sendJson(res, 200, { success: true, decks });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }

    if (method === 'POST') {
      try {
        const body = await parseBody<{ decks: VocabDeck[] }>(req);
        const decks = body.decks || [];
        const now = Date.now();

        for (const deck of decks) {
          // If deck is personal (not shared starter)
          const isSharedStarter = deck.id.startsWith('starter-') || deck.id.startsWith('cambridge-');
          const ownerId = isSharedStarter ? null : userId;

          await d1.execute(
            `INSERT INTO vocab_decks (id, owner_user_id, name, description, created_at, total_cards, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(id) DO UPDATE SET
               name = excluded.name,
               description = excluded.description,
               total_cards = excluded.total_cards,
               updated_at = CURRENT_TIMESTAMP;`,
            [deck.id, ownerId, deck.name, deck.description, deck.createdAt, deck.cards.length]
          );

          for (const card of deck.cards) {
            const cardOwner = isSharedStarter ? null : userId;
            await d1.execute(
              `INSERT INTO vocab_cards (
                 id, deck_id, owner_user_id, word, phonetic, part_of_speech, definition_vi,
                 definition_en, example, collocations, category, source, source_context, updated_at
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
               ON CONFLICT(id) DO UPDATE SET
                 word = excluded.word,
                 definition_vi = excluded.definition_vi,
                 definition_en = excluded.definition_en,
                 example = excluded.example,
                 collocations = excluded.collocations,
                 updated_at = CURRENT_TIMESTAMP;`,
              [
                card.id,
                deck.id,
                cardOwner,
                card.word,
                card.phonetic || '',
                card.partOfSpeech || 'academic',
                card.definitionVi,
                card.definitionEn || '',
                card.example || '',
                JSON.stringify(card.collocations || []),
                card.category || '',
                card.source || '',
                card.sourceContext || ''
              ]
            );

            // Upsert isolated SRS progress for this user
            await d1.execute(
              `INSERT INTO user_vocab_progress (
                 user_id, card_id, ease_factor, interval_days, repetitions,
                 next_review, last_review, learning_status, created_at, updated_at
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(user_id, card_id) DO UPDATE SET
                 ease_factor = excluded.ease_factor,
                 interval_days = excluded.interval_days,
                 repetitions = excluded.repetitions,
                 next_review = excluded.next_review,
                 last_review = excluded.last_review,
                 learning_status = excluded.learning_status,
                 updated_at = excluded.updated_at;`,
              [
                userId,
                card.id,
                card.easeFactor ?? 2.5,
                card.intervalDays ?? 1,
                card.repetition ?? 0,
                card.dueDate || new Date().toISOString(),
                card.lastReviewed || null,
                card.state || 'new',
                now,
                now
              ]
            );
          }
        }

        sendJson(res, 200, { success: true, count: decks.length });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }
  }

  // 5. Vocab Duplicate Check API
  if (pathname === '/api/vocab/check-duplicate' && method === 'GET') {
    try {
      const word = (url.searchParams.get('word') || '').trim().toLowerCase();
      if (!word) {
        sendJson(res, 400, { error: 'Word parameter is required' });
        return true;
      }
      const existing = await d1.query<any>(
        `SELECT c.*, p.next_review, p.learning_status, p.repetitions, p.interval_days
         FROM vocab_cards c
         LEFT JOIN user_vocab_progress p ON (p.card_id = c.id AND p.user_id = ?)
         WHERE (c.owner_user_id IS NULL OR c.owner_user_id = ?)
           AND LOWER(c.word) = ?
         LIMIT 1;`,
        [userId, userId, word]
      );
      if (existing.length > 0) {
        const item = existing[0];
        sendJson(res, 200, {
          exists: true,
          card: {
            id: item.id,
            deckId: item.deck_id,
            word: item.word,
            definitionVi: item.definition_vi,
            definitionEn: item.definition_en,
            example: item.example,
            sourceContext: item.source_context,
            nextReview: item.next_review,
            state: item.learning_status || 'new',
            repetition: item.repetitions || 0,
            intervalDays: item.interval_days || 1
          }
        });
      } else {
        sendJson(res, 200, { exists: false });
      }
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 6. Vocabulary Review Log API (Detailed audit trail & analytics)
  if (pathname === '/api/vocab/review-log' && method === 'POST') {
    try {
      const body = await parseBody<VocabReviewLog>(req);
      const logId = body.id || `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await d1.execute(
        `INSERT INTO vocab_review_log (
           id, user_id, card_id, review_mode, prompt_type, correct, rating,
           response_time_ms, hint_used, typed_answer, error_type, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          logId,
          userId,
          body.cardId,
          body.reviewMode || 'recall',
          body.promptType || null,
          body.correct ? 1 : 0,
          body.rating ?? null,
          body.responseTimeMs || 0,
          body.hintUsed ? 1 : 0,
          body.typedAnswer || null,
          body.errorType || 'NONE',
          body.createdAt || Date.now()
        ]
      );
      sendJson(res, 200, { success: true, id: logId });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 7. Add or Update single user-captured card (Personal)
  if (pathname === '/api/vocab/card' && method === 'POST') {
    try {
      const body = await parseBody<{ card: VocabCard; deckId: string; updateExisting?: boolean }>(req);
      const { card, deckId, updateExisting } = body;
      const now = Date.now();

      // Check if duplicate exists for this word
      const existingCards = await d1.query<any>(
        `SELECT id, source_context, definition_vi FROM vocab_cards
         WHERE (owner_user_id IS NULL OR owner_user_id = ?)
           AND LOWER(word) = LOWER(?)
         LIMIT 1;`,
        [userId, card.word]
      );

      if (existingCards.length > 0 && !updateExisting) {
        // Return duplicate alert with existing details so user can choose action
        const existing = existingCards[0];
        sendJson(res, 409, {
          error: 'duplicate_word',
          message: `Từ "${card.word}" đã có trong danh sách từ vựng.`,
          existingCardId: existing.id,
          existingContext: existing.source_context
        });
        return true;
      }

      const targetCardId = existingCards.length > 0 && updateExisting ? existingCards[0].id : card.id;

      // If updating existing, combine contexts if new context provided
      let finalContext = card.sourceContext || '';
      if (existingCards.length > 0 && existingCards[0].source_context && card.sourceContext) {
        if (!existingCards[0].source_context.includes(card.sourceContext)) {
          finalContext = `${existingCards[0].source_context}\n• ${card.sourceContext}`;
        } else {
          finalContext = existingCards[0].source_context;
        }
      }

      await d1.execute(
        `INSERT INTO vocab_cards (
           id, deck_id, owner_user_id, word, phonetic, part_of_speech, definition_vi, definition_en,
           example, collocations, category, source, source_context, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           definition_vi = excluded.definition_vi,
           definition_en = excluded.definition_en,
           example = excluded.example,
           source_context = excluded.source_context,
           updated_at = CURRENT_TIMESTAMP;`,
        [
          targetCardId,
          deckId,
          userId,
          card.word,
          card.phonetic || '',
          card.partOfSpeech || 'academic',
          card.definitionVi,
          card.definitionEn || '',
          card.example || '',
          JSON.stringify(card.collocations || []),
          card.category || '',
          card.source || '',
          finalContext
        ]
      );

      // Upsert isolated user progress
      await d1.execute(
        `INSERT INTO user_vocab_progress (
           user_id, card_id, ease_factor, interval_days, repetitions,
           next_review, learning_status, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, card_id) DO UPDATE SET
           updated_at = excluded.updated_at;`,
        [
          userId,
          targetCardId,
          card.easeFactor ?? 2.5,
          card.intervalDays ?? 1,
          card.repetition ?? 0,
          card.dueDate || new Date().toISOString(),
          card.state || 'new',
          now,
          now
        ]
      );

      // Update total_cards in deck
      await d1.execute(
        `UPDATE vocab_decks SET total_cards = (SELECT COUNT(*) FROM vocab_cards WHERE deck_id = ?) WHERE id = ?;`,
        [deckId, deckId]
      );

      sendJson(res, 200, { success: true, cardId: targetCardId });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 8. Update user card SRS rating (Isolated per user)
  if (pathname === '/api/vocab/review' && method === 'POST') {
    try {
      const body = await parseBody<{
        cardId: string;
        easeFactor: number;
        intervalDays: number;
        repetitions: number;
        nextReview: string;
        learningStatus: string;
      }>(req);

      const now = Date.now();
      await d1.execute(
        `INSERT INTO user_vocab_progress (
           user_id, card_id, ease_factor, interval_days, repetitions,
           next_review, last_review, learning_status, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, card_id) DO UPDATE SET
           ease_factor = excluded.ease_factor,
           interval_days = excluded.interval_days,
           repetitions = excluded.repetitions,
           next_review = excluded.next_review,
           last_review = excluded.last_review,
           learning_status = excluded.learning_status,
           updated_at = excluded.updated_at;`,
        [
          userId,
          body.cardId,
          body.easeFactor,
          body.intervalDays,
          body.repetitions,
          body.nextReview,
          new Date().toISOString(),
          body.learningStatus,
          now,
          now
        ]
      );

      sendJson(res, 200, { success: true });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 6. Test Attempts (Isolated per user)
  if (pathname === '/api/attempts') {
    if (method === 'GET') {
      try {
        const raw = await d1.query<any>(
          `SELECT * FROM test_attempts WHERE user_id = ? ORDER BY date DESC LIMIT 100;`,
          [userId]
        );
        const attempts: TestAttempt[] = raw.map(r => ({
          id: r.id,
          skill: r.skill,
          sectionId: r.section_id,
          sectionTitle: r.section_title,
          date: r.date,
          score: r.score,
          total: r.total_questions || 40,
          durationSeconds: r.time_spent_seconds || 0,
          mode: (r.test_type === 'full' ? 'simulation' : 'study') as any,
          userAnswers: r.detailed_answers ? JSON.parse(r.detailed_answers) : {},
          incorrectQuestionNumbers: [],
          questionTypeStats: r.question_type_stats ? JSON.parse(r.question_type_stats) : undefined,
          mistakeTags: r.mistake_tags ? JSON.parse(r.mistake_tags) : []
        }));
        sendJson(res, 200, { success: true, attempts });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }

    if (method === 'POST') {
      try {
        const attempt = await parseBody<TestAttempt>(req);
        await d1.execute(
          `INSERT INTO test_attempts (
             id, user_id, skill, section_id, section_title, test_type, date, score,
             total_questions, band_score, time_spent_seconds, question_type_stats,
             mistake_tags, detailed_answers
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO NOTHING;`,
          [
            attempt.id,
            userId,
            attempt.skill,
            attempt.sectionId,
            attempt.sectionTitle,
            attempt.mode === 'simulation' ? 'full' : 'practice',
            attempt.date,
            attempt.score,
            attempt.total,
            0,
            attempt.durationSeconds,
            JSON.stringify(attempt.questionTypeStats || {}),
            JSON.stringify(attempt.mistakeTags || []),
            JSON.stringify(attempt.userAnswers || {})
          ]
        );

        // Record mistakes under userId
        if (attempt.mistakeTags && attempt.mistakeTags.length > 0) {
          for (const m of attempt.mistakeTags) {
            const mId = `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            await d1.execute(
              `INSERT INTO recorded_mistakes (
                 id, user_id, skill, test_id, test_title, question_id, question_number,
                 question_type, error_type, user_answer, correct_answer, note, timestamp
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                mId,
                userId,
                attempt.skill,
                attempt.sectionId,
                attempt.sectionTitle,
                `${attempt.sectionId}-q${m.questionNumber}`,
                m.questionNumber,
                m.type,
                m.errorType || 'distractor',
                m.userAnswer || '',
                m.correctAnswer || '',
                m.distractorNote || m.paraphraseNote || '',
                attempt.date
              ]
            );
          }
        }

        sendJson(res, 200, { success: true });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }
  }

  // 7. Mistakes Tracker (Isolated per user)
  if (pathname === '/api/mistakes') {
    if (method === 'GET') {
      try {
        const raw = await d1.query<any>(
          `SELECT * FROM recorded_mistakes WHERE user_id = ? ORDER BY timestamp DESC LIMIT 200;`,
          [userId]
        );
        const mistakes: RecordedMistake[] = raw.map(r => ({
          id: r.id,
          skill: r.skill,
          testId: r.test_id,
          testTitle: r.test_title,
          questionId: r.question_id,
          questionNumber: r.question_number,
          questionType: r.question_type,
          errorType: r.error_type,
          userAnswer: r.user_answer,
          correctAnswer: r.correct_answer,
          note: r.note,
          timestamp: r.timestamp
        }));
        sendJson(res, 200, { success: true, mistakes });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }

    if (method === 'POST') {
      try {
        const m = await parseBody<RecordedMistake>(req);
        await d1.execute(
          `INSERT INTO recorded_mistakes (
             id, user_id, skill, test_id, test_title, question_id, question_number,
             question_type, error_type, user_answer, correct_answer, note, timestamp
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            m.id,
            userId,
            m.skill,
            m.testId,
            m.testTitle,
            m.questionId,
            m.questionNumber,
            m.questionType,
            m.errorType || 'distractor',
            m.userAnswer,
            m.correctAnswer,
            m.note || '',
            m.timestamp
          ]
        );
        sendJson(res, 200, { success: true });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }
  }

  // 8. Grammar Progress (Isolated per user)
  if (pathname === '/api/grammar') {
    if (method === 'GET') {
      try {
        const raw = await d1.query<any>(
          `SELECT topic_id, status, last_studied FROM grammar_progress WHERE user_id = ?;`,
          [userId]
        );
        const progress: Record<string, GrammarProgressStatus> = {};
        raw.forEach(r => {
          progress[r.topic_id] = r.status as GrammarProgressStatus;
        });
        sendJson(res, 200, { success: true, progress });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }

    if (method === 'POST') {
      try {
        const body = await parseBody<{ topicId: string; status: GrammarProgressStatus }>(req);
        await d1.execute(
          `INSERT INTO grammar_progress (user_id, topic_id, status, last_studied, updated_at)
           VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT(user_id, topic_id) DO UPDATE SET
             status = excluded.status,
             last_studied = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP;`,
          [userId, body.topicId, body.status]
        );
        sendJson(res, 200, { success: true });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }
  }

  // 9. Daily Protocol (Isolated per user)
  if (pathname.startsWith('/api/protocol')) {
    if (method === 'GET') {
      try {
        const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
        const raw = await d1.query<any>(
          `SELECT * FROM daily_protocol WHERE user_id = ? AND date = ?;`,
          [userId, date]
        );
        if (raw.length > 0) {
          const r = raw[0];
          const record: DailyProtocolRecord = {
            date: r.date,
            dayNumber: r.day_number,
            tasks: JSON.parse(r.tasks),
            streakDays: r.streak_days || 1
          };
          sendJson(res, 200, { success: true, record });
        } else {
          sendJson(res, 200, { success: true, record: null });
        }
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }

    if (method === 'POST') {
      try {
        const record = await parseBody<DailyProtocolRecord>(req);
        await d1.execute(
          `INSERT INTO daily_protocol (user_id, date, day_number, tasks, streak_days, updated_at)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(user_id, date) DO UPDATE SET
             day_number = excluded.day_number,
             tasks = excluded.tasks,
             streak_days = excluded.streak_days,
             updated_at = CURRENT_TIMESTAMP;`,
          [userId, record.date, record.dayNumber, JSON.stringify(record.tasks), record.streakDays || 1]
        );
        sendJson(res, 200, { success: true });
      } catch (err: any) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return true;
    }
  }

  return false;
}

// -------------------------------------------------------------
// STATIC FILE SERVING
// -------------------------------------------------------------

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse, url: URL) {
  let reqPath = decodeURIComponent(url.pathname);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists, else fallback to index.html (SPA)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('App not built yet. Please run npm run build.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);

  const headers: Record<string, string | number> = {
    'Content-Type': contentType,
    'Content-Length': stat.size
  };

  if (ext === '.html') {
    headers['Cache-Control'] = 'no-cache';
  } else {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }

  res.writeHead(200, headers);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

// -------------------------------------------------------------
// MAIN SERVER ENTRY
// -------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api')) {
      const handled = await handleApiRoutes(req, res, url);
      if (!handled) {
        sendJson(res, 404, { error: 'API endpoint not found' });
      }
      return;
    }

    serveStatic(req, res, url);
  } catch (err: any) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: 'Internal Server Error', message: err.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` IELTS Prep Studio Server (Multi-User D1 Mode)`);
  console.log(` Running at http://0.0.0.0:${PORT}`);
  console.log(` Serving static from: ${DIST_DIR}`);
  console.log(` Cloudflare D1 Configured: ${d1.isConfigured() ? 'YES' : 'NO'}`);
  console.log(`===============================================`);
});
