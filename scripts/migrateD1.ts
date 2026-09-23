import fs from 'fs';
import path from 'path';

function loadEnv(): Record<string, string> {
  const envPath = path.resolve('.env');
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

export async function migrateD1() {
  const env = loadEnv();
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_DATABASE_ID || process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    console.error('Missing Cloudflare D1 credentials in .env or environment.');
    process.exit(1);
  }

  const schemaSql = fs.readFileSync('server/schema.sql', 'utf-8');
  // Strip block/line comments and clean up
  const cleanSql = schemaSql
    .replace(/--.*$/gm, '')
    .trim();

  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Running migration: executing ${statements.length} SQL statements on Cloudflare D1...`);

  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i];
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      }
    );
    const json = (await res.json()) as any;
    if (!json.success) {
      console.error(`Statement ${i + 1} failed:`, json.errors);
      console.error('SQL:', sql);
      process.exit(1);
    }
    console.log(`✓ [${i + 1}/${statements.length}] executed: ${sql.slice(0, 40).replace(/\n/g, ' ')}...`);
  }

  // Check tables
  const checkRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;" })
    }
  );
  const checkJson = (await checkRes.json()) as any;
  const tables = checkJson.result[0].results.map((r: any) => r.name);
  console.log('\nAll D1 Tables verified:', tables);
}

migrateD1().catch(console.error);
