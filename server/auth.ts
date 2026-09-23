/**
 * Native Server-Side Authentication & Session Engine
 * Built with Node.js crypto (scrypt + timingSafeEqual)
 * Zero external authentication dependencies.
 */

import crypto from 'crypto';
import http from 'http';
import { d1 } from './d1Client';

export interface User {
  id: string;
  email: string;
  displayName: string;
  currentBand: number;
  targetBand: number;
  dailyStudyMinutes: number;
  roadmapStartDate?: string;
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
  isActive: number;
}

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const SESSION_COOKIE_NAME = 'ielts_session';

/**
 * Hash a password using Node.js crypto.scrypt with a 16-byte random salt
 */
export function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({
        hash: derivedKey.toString('hex'),
        salt
      });
    });
  });
}

/**
 * Verify a password with timingSafeEqual against scrypt hash
 */
export function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      try {
        const storedKey = Buffer.from(hash, 'hex');
        if (storedKey.length !== derivedKey.length) {
          return resolve(false);
        }
        resolve(crypto.timingSafeEqual(storedKey, derivedKey));
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Create a secure random session token and store its sha256 hash in D1
 */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: number }> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const sessionId = `sess-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const now = Date.now();
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;

  await d1.execute(
    `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [sessionId, userId, tokenHash, now, expiresAt, now]
  );

  // Update user last_login_at
  await d1.execute(
    `UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?;`,
    [now, now, userId]
  );

  return { token, expiresAt };
}

/**
 * Validate session token from cookie, checking expiration and loading user
 */
export async function validateSession(token: string): Promise<User | null> {
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const now = Date.now();

  try {
    const rows = await d1.query<any>(
      `SELECT s.id as session_id, s.expires_at,
              u.id, u.email, u.display_name, u.current_band, u.target_band,
              u.daily_study_minutes, u.roadmap_start_date, u.created_at,
              u.updated_at, u.last_login_at, u.is_active
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = ? AND s.expires_at > ? AND u.is_active = 1
       LIMIT 1;`,
      [tokenHash, now]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    const r = rows[0];

    // Background update last_seen_at (fire-and-forget)
    d1.execute(`UPDATE sessions SET last_seen_at = ? WHERE id = ?;`, [now, r.session_id]).catch(() => {});

    return {
      id: r.id,
      email: r.email,
      displayName: r.display_name,
      currentBand: r.current_band || 4.0,
      targetBand: r.target_band || 6.5,
      dailyStudyMinutes: r.daily_study_minutes || 180,
      roadmapStartDate: r.roadmap_start_date || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      lastLoginAt: r.last_login_at || undefined,
      isActive: r.is_active
    };
  } catch (err) {
    console.error('validateSession error:', err);
    return null;
  }
}

/**
 * Revoke session in database
 */
export async function revokeSession(token: string): Promise<void> {
  if (!token) return;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await d1.execute(`DELETE FROM sessions WHERE token_hash = ?;`, [tokenHash]);
}

/**
 * Parse cookies from IncomingMessage
 */
export function parseCookies(req: http.IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const rc = req.headers.cookie;
  if (!rc) return list;

  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('=').trim());
    }
  });

  return list;
}

/**
 * Build Set-Cookie header value
 */
export function buildSessionCookie(token: string, maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS): string {
  const isProd = process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true';
  const secureFlag = isProd ? '; Secure' : '';
  if (maxAgeSeconds <= 0) {
    return `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${secureFlag}`;
  }
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${secureFlag}`;
}

/**
 * Middleware: Requires an authenticated user from the session cookie
 * Throws 401 Error if unauthenticated
 */
export async function requireUser(req: http.IncomingMessage): Promise<User> {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) {
    const err: any = new Error('Authentication required');
    err.statusCode = 401;
    throw err;
  }

  const user = await validateSession(token);
  if (!user) {
    const err: any = new Error('Invalid or expired session');
    err.statusCode = 401;
    throw err;
  }

  return user;
}
