import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { d1 } from './d1Client';

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface OAuthState {
  userId: string;
  verifier: string;
  expiresAt: number;
}

export interface StudyCalendarEvent {
  date: string;
  start: string;
  end: string;
  summary: string;
  description: string;
  url: string;
}

const TOKEN_KEY = 'google_calendar_tokens';
const SYNCED_EVENTS_KEY = 'google_calendar_study_events';
const oauthStates = new Map<string, OAuthState>();

function configuration() {
  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || '',
    encryptionKey: process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || '',
  };
}

export function isGoogleCalendarConfigured(): boolean {
  const config = configuration();
  if (!config.clientId || !config.clientSecret || !config.redirectUri || !config.encryptionKey) return false;
  try {
    encryptionKey();
    const redirect = new URL(config.redirectUri);
    return redirect.protocol === 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(redirect.hostname);
  } catch {
    return false;
  }
}

function encryptionKey(): Buffer {
  const raw = configuration().encryptionKey;
  const key = /^[\da-f]{64}$/i.test(raw) ? Buffer.from(raw, 'hex') : Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY must encode exactly 32 bytes (base64 or 64 hex characters).');
  return key;
}

function encryptTokens(tokens: GoogleTokens): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(tokens), 'utf8'), cipher.final()]);
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
}

function decryptTokens(value: string): GoogleTokens {
  const [ivText, tagText, dataText] = value.split('.');
  if (!ivText || !tagText || !dataText) throw new Error('Saved Google Calendar credentials could not be read.');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivText, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(dataText, 'base64url')),
    decipher.final(),
  ]).toString('utf8')) as GoogleTokens;
}

async function saveTokens(userId: string, tokens: GoogleTokens): Promise<void> {
  await d1.execute(
    `INSERT INTO meta_settings (user_id, key, value, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
    [userId, TOKEN_KEY, encryptTokens(tokens), new Date().toISOString()],
  );
}

async function loadTokens(userId: string): Promise<GoogleTokens | null> {
  const rows = await d1.query<{ value: string }>(
    'SELECT value FROM meta_settings WHERE user_id = ? AND key = ? LIMIT 1;',
    [userId, TOKEN_KEY],
  );
  return rows[0] ? decryptTokens(rows[0].value) : null;
}

async function loadSyncedEvents(userId: string): Promise<Record<string, string>> {
  const rows = await d1.query<{ value: string }>(
    'SELECT value FROM meta_settings WHERE user_id = ? AND key = ? LIMIT 1;',
    [userId, SYNCED_EVENTS_KEY],
  );
  if (!rows[0]) return {};
  try { return JSON.parse(rows[0].value) as Record<string, string>; }
  catch { return {}; }
}

async function saveSyncedEvents(userId: string, events: Record<string, string>): Promise<void> {
  await d1.execute(
    `INSERT INTO meta_settings (user_id, key, value, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
    [userId, SYNCED_EVENTS_KEY, JSON.stringify(events), new Date().toISOString()],
  );
}

async function tokenRequest(params: URLSearchParams): Promise<any> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error_description || data.error || 'Google OAuth token request failed.');
  return data;
}

export function createGoogleAuthorizationUrl(userId: string): string {
  if (!isGoogleCalendarConfigured()) throw new Error('Google Calendar is not configured on this server.');
  const config = configuration();
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const now = Date.now();
  for (const [key, entry] of oauthStates) if (entry.expiresAt <= now) oauthStates.delete(key);
  oauthStates.set(state, { userId, verifier, expiresAt: now + 10 * 60_000 });

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  return url.toString();
}

export async function completeGoogleAuthorization(state: string, code: string): Promise<void> {
  const pending = oauthStates.get(state);
  oauthStates.delete(state);
  if (!pending || pending.expiresAt < Date.now()) throw new Error('Google authorization expired. Please connect again.');

  const config = configuration();
  const result = await tokenRequest(new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    code_verifier: pending.verifier,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
  }));
  if (!result.refresh_token) throw new Error('Google did not return a refresh token. Revoke the app access and connect again.');
  await saveTokens(pending.userId, {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    expiresAt: Date.now() + Number(result.expires_in || 3600) * 1000,
  });
}

async function getAccessToken(userId: string): Promise<string> {
  const tokens = await loadTokens(userId);
  if (!tokens) throw new Error('Google Calendar is not connected for this account.');
  if (tokens.expiresAt > Date.now() + 60_000) return tokens.accessToken;

  const config = configuration();
  const refreshed = await tokenRequest(new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: tokens.refreshToken,
    grant_type: 'refresh_token',
  }));
  const next = {
    ...tokens,
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + Number(refreshed.expires_in || 3600) * 1000,
  };
  await saveTokens(userId, next);
  return next.accessToken;
}

function googleEventId(): string {
  // Google accepts lower-case base32hex IDs; hexadecimal random bytes are a valid subset.
  return `ielts${randomBytes(16).toString('hex')}`;
}

function localDateInZone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: string) => parts.find(item => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function validateEvents(events: unknown): StudyCalendarEvent[] {
  if (!Array.isArray(events) || events.length > 7) throw new Error('Send at most one study block per date for the next seven days.');
  const valid = events.map((event: any) => {
    if (!event || typeof event !== 'object' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(event.date) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.start) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.end) || event.end <= event.start ||
        typeof event.summary !== 'string' || event.summary.length > 120 ||
        typeof event.description !== 'string' || event.description.length > 8000 ||
        typeof event.url !== 'string' || event.url.length > 500) {
      throw new Error('One or more study blocks have invalid fields.');
    }
    return event as StudyCalendarEvent;
  });
  if (new Set(valid.map(event => event.date)).size !== valid.length) throw new Error('A study plan can contain only one block per date.');
  return valid;
}

export async function syncGoogleStudyBlocks(userId: string, events: unknown, timeZone: string): Promise<{ synced: number; removed: number }> {
  const blocks = validateEvents(events);
  if ((timeZone !== 'UTC' && !/^[A-Za-z_+-]+(?:\/[A-Za-z0-9_+.-]+)+$/.test(timeZone)) || timeZone.length > 80) {
    throw new Error('A valid IANA time zone is required.');
  }
  const accessToken = await getAccessToken(userId);
  const previousEvents = await loadSyncedEvents(userId);
  const eventIds = { ...previousEvents };
  const currentDates = new Set(blocks.map(block => block.date));
  const today = localDateInZone(timeZone);
  const managedWindow = new Set(Array.from({ length: 7 }, (_, index) => addDays(today, index)));
  const staleDates = Object.keys(eventIds).filter(date => managedWindow.has(date) && !currentDates.has(date));
  let removed = 0;
  const base = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

  for (const date of staleDates) {
    const id = eventIds[date];
    const existing = await fetch(`${base}/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (existing.status !== 404 && existing.status !== 410) {
      if (!existing.ok) throw new Error(`Google Calendar could not read a saved study block (HTTP ${existing.status}).`);
      const deletion = await fetch(`${base}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      if (!deletion.ok && deletion.status !== 404 && deletion.status !== 410) {
        throw new Error(`Google Calendar could not remove an outdated study block (HTTP ${deletion.status}).`);
      }
      removed += 1;
    }
    delete eventIds[date];
    await saveSyncedEvents(userId, eventIds);
  }

  let synced = 0;

  for (const block of blocks) {
    let id = eventIds[block.date] || googleEventId();
    const body = {
      id,
      summary: block.summary,
      description: block.description,
      start: { dateTime: `${block.date}T${block.start}:00`, timeZone },
      end: { dateTime: `${block.date}T${block.end}:00`, timeZone },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 10 }] },
      extendedProperties: { private: { source: 'ielts-prep-studio' } },
    };
    const existing = await fetch(`${base}/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    let response: Response;
    if (existing.status === 404 || existing.status === 410) {
      response = await fetch(base, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else if (existing.ok) {
      const { id: _eventId, ...updateBody } = body;
      response = await fetch(`${base}/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody),
      });
    } else {
      throw new Error(`Google Calendar could not read a study block (HTTP ${existing.status}).`);
    }
    if (response.status === 409) {
      id = googleEventId();
      body.id = id;
      eventIds[block.date] = id;
      await saveSyncedEvents(userId, eventIds);
      response = await fetch(base, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    if (!response.ok) throw new Error(`Google Calendar could not save a study block (HTTP ${response.status}).`);
    eventIds[block.date] = id;
    await saveSyncedEvents(userId, eventIds);
    synced += 1;
  }
  await saveSyncedEvents(userId, eventIds);
  return { synced, removed };
}

export async function disconnectGoogleCalendar(userId: string): Promise<void> {
  const tokens = await loadTokens(userId);
  if (tokens) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(tokens.refreshToken)}`, { method: 'POST' });
    } catch { /* Local disconnect must still remove the saved credential. */ }
  }
  await d1.execute('DELETE FROM meta_settings WHERE user_id = ? AND key = ?;', [userId, TOKEN_KEY]);
}

export async function hasGoogleCalendarConnection(userId: string): Promise<boolean> {
  return Boolean(await loadTokens(userId));
}
