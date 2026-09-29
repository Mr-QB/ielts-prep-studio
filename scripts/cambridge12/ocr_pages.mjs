import fs from 'node:fs';
import path from 'node:path';
import { createWorker } from 'tesseract.js';

const inputDir = path.resolve(process.argv[2] || '.tmp/cambridge12/pages');
const outputDir = path.resolve('.tmp/cambridge12/ocr_draft');
const cacheDir = path.resolve('.tmp/cambridge12/tessdata');
const issuesDir = path.resolve('.tmp/cambridge12/validation');
if (!fs.existsSync(inputDir)) throw new Error(`Rendered pages not found: ${inputDir}`);
const images = fs.readdirSync(inputDir).filter(name => /^page-\d+\.png$/i.test(name)).sort();
if (!images.length) throw new Error(`No scan images to OCR in ${inputDir}`);
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(issuesDir, { recursive: true });
const writeReviewReport = inventory => {
  const manuallyReviewedPages = new Set([17, 18, 19, 20, 124, 125, 126, 127, 128, 129, 130, 131]);
  for (const item of inventory) if (manuallyReviewedPages.has(item.sourcePdfPage)) item.status = 'manually_verified_against_source_page';
  const issues = inventory.filter(item => item.confidence < 88 && !manuallyReviewedPages.has(item.sourcePdfPage)).map(item => ({
    status: 'needs_review', sourcePdfPage: item.sourcePdfPage,
    reason: `OCR confidence ${item.confidence}% is below 88%; compare the page image and verify its text and layout.`
  }));
  fs.writeFileSync(path.join(issuesDir, 'issues.json'), `${JSON.stringify(issues, null, 2)}\n`, 'utf8');
  return issues;
};

if (process.argv.includes('--report-only')) {
  const inventoryPath = path.join(outputDir, 'inventory.json');
  if (!fs.existsSync(inventoryPath)) throw new Error(`OCR inventory not found: ${inventoryPath}`);
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const issues = writeReviewReport(inventory);
  fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
  console.log(`OCR drafts: ${inventory.length}; pages needing manual review: ${issues.length}; report: ${path.join(issuesDir, 'issues.json')}`);
  process.exit(0);
}

const worker = await createWorker('eng', 1, {
  cachePath: cacheDir,
  logger: message => {
    if (message.status === 'recognizing text' && message.progress === 1) console.log(`OCR page progress: ${message.status}`);
  }
});
const inventory = [];
try {
  for (const image of images) {
    const sourcePdfPage = Number(image.match(/\d+/)?.[0]);
    const { data } = await worker.recognize(path.join(inputDir, image));
    const outName = image.replace(/\.png$/i, '.txt');
    fs.writeFileSync(path.join(outputDir, outName), data.text, 'utf8');
    const needsManualReview = data.confidence < 88;
    const item = { sourcePdfPage, sourceImage: image, confidence: data.confidence, status: 'needs_manual_validation', needsManualReview, draft: outName };
    inventory.push(item);
    console.log(`PDF page ${sourcePdfPage}: OCR draft, confidence ${data.confidence}%`);
  }
} finally {
  await worker.terminate();
}
fs.writeFileSync(path.join(outputDir, 'inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
const issues = writeReviewReport(inventory);
console.log(`OCR drafts written: ${inventory.length}; pages needing manual review: ${issues.length}; none were added to app data automatically.`);
