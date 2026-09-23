/**
 * Private Listening Material Importer
 * Usage: npx tsx scripts/importListening.ts [path/to/test.json]
 * Validates and checks custom user-imported Cambridge listening tests.
 */
import fs from 'fs';
import path from 'path';

const defaultImportDir = path.resolve(process.cwd(), 'data/private/import/listening');

function run() {
  console.log('=== IELTS PREP STUDIO - PRIVATE LISTENING IMPORTER ===\n');

  if (!fs.existsSync(defaultImportDir)) {
    fs.mkdirSync(defaultImportDir, { recursive: true });
    console.log(`Created private import folder at: ${defaultImportDir}`);
    console.log('Place your private JSON files (e.g. test01.json) and audio files there.');
    return;
  }

  const files = fs.readdirSync(defaultImportDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log(`No JSON files found in ${defaultImportDir}.`);
    console.log('Ensure you format your test JSON according to ListeningFullTest schema.');
    return;
  }

  console.log(`Found ${files.length} test file(s) to process:\n`);

  files.forEach(file => {
    const fullPath = path.join(defaultImportDir, file);
    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(raw);

      console.log(`-> Validating: ${file}`);
      if (!data.id || !data.title) {
        console.error(`   ❌ Missing "id" or "title" in ${file}`);
        return;
      }
      if (!Array.isArray(data.sections) || data.sections.length !== 4) {
        console.error(`   ❌ Listening full test must contain exactly 4 sections (parts), found: ${data.sections?.length || 0}`);
        return;
      }

      let totalQuestions = 0;
      data.sections.forEach((s: any, idx: number) => {
        totalQuestions += s.questions?.length || 0;
      });

      if (totalQuestions !== 40) {
        console.warn(`   ⚠️ Warning: Full test standard is 40 questions, found: ${totalQuestions}`);
      } else {
        console.log(`   ✅ Validated: 4 parts, 40 questions.`);
      }

      console.log(`   [READY] Material is ready for local offline study.\n`);
    } catch (err: any) {
      console.error(`   ❌ Failed to parse ${file}: ${err.message}`);
    }
  });
}

run();
