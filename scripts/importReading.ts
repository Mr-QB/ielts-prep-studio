/**
 * Private Reading Material Importer
 * Usage: npx tsx scripts/importReading.ts [path/to/test.json]
 * Validates and checks custom user-imported Cambridge reading tests.
 */
import fs from 'fs';
import path from 'path';

const defaultImportDir = path.resolve(process.cwd(), 'data/private/import/reading');

function run() {
  console.log('=== IELTS PREP STUDIO - PRIVATE READING IMPORTER ===\n');

  if (!fs.existsSync(defaultImportDir)) {
    fs.mkdirSync(defaultImportDir, { recursive: true });
    console.log(`Created private import folder at: ${defaultImportDir}`);
    console.log('Place your private JSON files (e.g. test01.json) there to import.');
    return;
  }

  const files = fs.readdirSync(defaultImportDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log(`No JSON files found in ${defaultImportDir}.`);
    console.log('Ensure you format your test JSON according to ReadingFullTest schema.');
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
      if (!Array.isArray(data.passages) || data.passages.length !== 3) {
        console.error(`   ❌ Reading full test must contain exactly 3 passages, found: ${data.passages?.length || 0}`);
        return;
      }

      let totalQuestions = 0;
      data.passages.forEach((p: any, idx: number) => {
        totalQuestions += p.questions?.length || 0;
      });

      if (totalQuestions !== 40) {
        console.warn(`   ⚠️ Warning: Full test standard is 40 questions, found: ${totalQuestions}`);
      } else {
        console.log(`   ✅ Validated: 3 passages, 40 questions.`);
      }

      console.log(`   [READY] Material is ready for local offline study.\n`);
    } catch (err: any) {
      console.error(`   ❌ Failed to parse ${file}: ${err.message}`);
    }
  });
}

run();
