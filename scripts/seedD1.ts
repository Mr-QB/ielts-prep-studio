import { INITIAL_VOCAB_DECKS } from '../src/data/vocabData';

async function seed() {
  const url = 'http://127.0.0.1:8085/api/decks';
  console.log(`Seeding ${INITIAL_VOCAB_DECKS.length} starter vocab decks to Cloudflare D1...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decks: INITIAL_VOCAB_DECKS })
  });

  const json = await res.json();
  console.log('Seed response:', json);

  const checkRes = await fetch(url);
  const checkJson = await checkRes.json() as any;
  console.log(`Verified: ${checkJson.decks?.length} decks retrieved from Cloudflare D1.`);
  for (const d of checkJson.decks || []) {
    console.log(` - Deck "${d.name}": ${d.cards?.length} cards`);
  }
}

seed().catch(console.error);
