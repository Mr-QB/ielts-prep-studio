/**
 * Cloudflare D1 Client Wrapper
 * Communicates directly with Cloudflare D1 via the Cloudflare REST API.
 */

import fs from 'fs';
import path from 'path';

function ensureEnvLoaded() {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
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
  }
}

export interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  meta?: {
    duration?: number;
    rows_read?: number;
    rows_written?: number;
    changes?: number;
    last_row_id?: number;
  };
}

export interface D1Response<T = any> {
  result: D1QueryResult<T>[];
  success: boolean;
  errors: any[];
  messages: any[];
}

export class D1Client {
  private get accountId(): string {
    ensureEnvLoaded();
    return process.env.CLOUDFLARE_ACCOUNT_ID || '';
  }

  private get databaseId(): string {
    ensureEnvLoaded();
    return process.env.CLOUDFLARE_DATABASE_ID || '';
  }

  private get apiToken(): string {
    ensureEnvLoaded();
    return process.env.CLOUDFLARE_API_TOKEN || '';
  }

  private get endpoint(): string {
    return `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
  }

  public isConfigured(): boolean {
    return Boolean(this.accountId && this.databaseId && this.apiToken);
  }

  public async checkHealth(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
    if (!this.isConfigured()) {
      return { connected: false, latencyMs: 0, error: 'Cloudflare D1 credentials not configured.' };
    }
    const start = Date.now();
    try {
      const res = await this.query('SELECT 1 as alive;');
      const latencyMs = Date.now() - start;
      return { connected: res.length > 0, latencyMs };
    } catch (err: any) {
      return { connected: false, latencyMs: Date.now() - start, error: err.message || String(err) };
    }
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isConfigured()) {
      throw new Error('Cloudflare D1 credentials missing');
    }

    const payload: { sql: string; params?: any[] } = { sql };
    if (params && params.length > 0) {
      payload.params = params;
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudflare D1 HTTP ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as D1Response<T>;
    if (!data.success || !data.result || data.result.length === 0) {
      throw new Error(`D1 Query Error: ${JSON.stringify(data.errors || data)}`);
    }

    return data.result[0].results || [];
  }

  public async execute(sql: string, params: any[] = []): Promise<{ success: boolean; changes?: number }> {
    if (!this.isConfigured()) {
      throw new Error('Cloudflare D1 credentials missing');
    }

    const payload: { sql: string; params?: any[] } = { sql };
    if (params && params.length > 0) {
      payload.params = params;
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudflare D1 HTTP ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as D1Response;
    if (!data.success) {
      throw new Error(`D1 Execution Error: ${JSON.stringify(data.errors)}`);
    }

    const changes = data.result[0]?.meta?.changes || 0;
    return { success: true, changes };
  }
}

export const d1 = new D1Client();
