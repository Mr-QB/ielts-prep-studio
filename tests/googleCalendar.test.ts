import assert from 'node:assert/strict';
import test from 'node:test';
import { createGoogleAuthorizationUrl, isGoogleCalendarConfigured } from '../server/googleCalendar';

const keys = [
  'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'GOOGLE_OAUTH_REDIRECT_URI',
  'GOOGLE_TOKEN_ENCRYPTION_KEY',
] as const;

function withCalendarEnvironment(run: () => void, key = Buffer.alloc(32, 7).toString('hex')) {
  const previous = Object.fromEntries(keys.map(name => [name, process.env[name]]));
  process.env.GOOGLE_OAUTH_CLIENT_ID = 'client-id';
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'client-secret';
  process.env.GOOGLE_OAUTH_REDIRECT_URI = 'http://localhost:8085/api/calendar/oauth/callback';
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = key;
  try { run(); }
  finally {
    for (const name of keys) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
}

test('Google Calendar OAuth requires a valid redirect URI and 32-byte token key', () => {
  withCalendarEnvironment(() => {
    assert.equal(isGoogleCalendarConfigured(), true);
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = 'too-short';
    assert.equal(isGoogleCalendarConfigured(), false);
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('hex');
    process.env.GOOGLE_OAUTH_REDIRECT_URI = 'file:///tmp/callback';
    assert.equal(isGoogleCalendarConfigured(), false);
  });
});

test('Google Calendar authorization requests calendar event access with PKCE', () => {
  withCalendarEnvironment(() => {
    const url = new URL(createGoogleAuthorizationUrl('user-123'));
    assert.equal(url.origin, 'https://accounts.google.com');
    assert.equal(url.searchParams.get('client_id'), 'client-id');
    assert.equal(url.searchParams.get('scope'), 'https://www.googleapis.com/auth/calendar.events');
    assert.equal(url.searchParams.get('access_type'), 'offline');
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
    assert.ok(url.searchParams.get('state'));
    assert.ok(url.searchParams.get('code_challenge'));
  });
});
