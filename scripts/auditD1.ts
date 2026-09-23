import { d1 } from '../server/d1Client';

async function audit() {
  console.log('=== AUDITING CLOUDFLARE D1 TABLES & ROWS ===');
  const tables = [
    'vocab_decks',
    'vocab_cards',
    'test_attempts',
    'recorded_mistakes',
    'grammar_progress',
    'daily_protocol',
    'meta_settings'
  ];

  for (const t of tables) {
    try {
      const res = await d1.query(`SELECT COUNT(*) as count FROM ${t}`);
      const count = res[0]?.count ?? 0;
      console.log(`Table ${t.padEnd(20)}: ${count} rows`);
    } catch (err: any) {
      console.log(`Table ${t.padEnd(20)}: ERROR - ${err.message}`);
    }
  }

  // Sample check on vocab_cards
  try {
    const cards = await d1.query('SELECT id, deck_id, word, ease_factor, interval_days, repetition, state FROM vocab_cards LIMIT 3');
    console.log('\nSample vocab_cards:', cards);
  } catch (err: any) {
    console.error('Error fetching sample cards:', err.message);
  }

  // Check grammar_progress
  try {
    const grammar = await d1.query('SELECT * FROM grammar_progress LIMIT 5');
    console.log('\nSample grammar_progress:', grammar);
  } catch (err: any) {
    console.error('Error fetching sample grammar:', err.message);
  }
}

audit().catch(console.error);
