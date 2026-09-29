import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import type { BookAnswerKey, PrivateBookManifest, PrivateListeningTest, PrivateListeningTranscripts, PrivateReadingSection, PrivateWritingSection } from '../src/types/bookPractice';
import { flattenBookReadingQuestions, validateBookAnswerKey, validatePrivateReadingSection } from '../src/utils/bookPractice';

const packDir = path.resolve('data/private/cambridge12_gt');
if (!fs.existsSync(packDir)) {
  console.log('[Cambridge 12 GT] Private pack not installed; skipping local content validation.');
  process.exit(0);
}

const read = <T>(filename: string): T => JSON.parse(fs.readFileSync(path.join(packDir, filename), 'utf8')) as T;
const manifest = read<PrivateBookManifest>('manifest.json');
const readingTests = [5, 6, 7, 8].map(testNumber => ({
  testNumber,
  sections: [1, 2, 3].map(number => read<PrivateReadingSection>(`test_${String(testNumber).padStart(2, '0')}/reading${number === 1 ? '' : `_${number}`}.json`)),
  answerKey: read<BookAnswerKey>(`test_${String(testNumber).padStart(2, '0')}/reading_answers.json`)
}));
const { sections: readingSections, answerKey: answers } = readingTests[0];
const section = readingSections[0];
const errors: string[] = [];

if (!manifest.private || manifest.bookId !== section.bookId) errors.push('Manifest privacy or book ID does not match the section.');
if (manifest.id !== manifest.bookId || manifest.version !== 1 || manifest.isbn !== '9781316637838') errors.push('Manifest identity, version, or ISBN is invalid.');
if (manifest.source?.sourcePdfSha256) {
  const sourcePath = path.resolve('private_sources/cambridge12_gt/book.pdf');
  if (fs.existsSync(sourcePath)) {
    const digest = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');
    if (digest !== manifest.source.sourcePdfSha256) errors.push('Local source PDF does not match the manifest SHA-256.');
  } else errors.push('The source PDF recorded by the manifest is missing locally; source processing cannot be verified.');
}
if (manifest.importReview?.status !== 'complete') errors.push('The manifest does not mark the imported content review as complete.');
if (!manifest.importReview?.reviewedPrintedPages.length || new Set(manifest.importReview.reviewedPrintedPages).size !== manifest.importReview.reviewedPrintedPages.length) errors.push('The source-page review list is empty or contains duplicate pages.');
if (manifest.importReview?.unsupportedLayouts.length) errors.push('The manifest contains unsupported content layouts.');
const issueFile = path.resolve('.tmp/cambridge12/validation/issues.json');
if (fs.existsSync(issueFile)) {
  const issues = JSON.parse(fs.readFileSync(issueFile, 'utf8')) as Array<{ status?: string; sourcePdfPage?: number }>;
  const unresolved = issues.filter(issue => issue.status !== 'reviewed');
  if (unresolved.length) errors.push(`${unresolved.length} extraction issue(s) in the local source audit are not marked reviewed.`);
  for (const issue of issues) {
    if (issue.sourcePdfPage && !manifest.importReview?.reviewedPrintedPages.includes(issue.sourcePdfPage - 1)) errors.push(`Audited PDF page ${issue.sourcePdfPage} is absent from the manifest's printed-page review list.`);
  }
}
for (const readingTest of readingTests) {
  const { testNumber, sections, answerKey } = readingTest;
  if (!manifest.tests.includes(testNumber)) errors.push(`Manifest does not list Test ${testNumber}.`);
  if (answerKey.testNumber !== testNumber || answerKey.module !== 'reading') errors.push(`Test ${testNumber} Reading answer key identity is invalid.`);
  for (const [index, readingSection] of sections.entries()) {
    const numbers = readingSection.questionGroups.flatMap(group => group.questions.map(question => question.number));
    const sectionAnswers: BookAnswerKey = { ...answerKey, answers: Object.fromEntries(Object.entries(answerKey.answers).filter(([number]) => numbers.includes(Number(number)))), constraints: answerKey.constraints?.filter(group => group.questionNumbers.every(number => numbers.includes(number))) };
    if (readingSection.testNumber !== testNumber || readingSection.sectionNumber !== index + 1) errors.push(`Test ${testNumber} Reading Section ${index + 1} identity is invalid.`);
    if (!manifest.importedSections.some(entry => entry.testNumber === testNumber && entry.skill === 'reading' && entry.sectionNumber === index + 1)) errors.push(`Manifest does not list Test ${testNumber} Reading Section ${index + 1}.`);
    errors.push(...validatePrivateReadingSection(readingSection, sectionAnswers));
  }
  const testQuestions = sections.flatMap(flattenBookReadingQuestions).sort((a, b) => a.number - b.number);
  if (testQuestions.length !== 40 || testQuestions.some((question, index) => question.number !== index + 1)) errors.push(`Test ${testNumber} Reading must contain exactly one each of Questions 1–40.`);
  console.log(`[Cambridge 12 GT] Test ${testNumber} Reading: ${testQuestions.length} questions and ${Object.keys(answerKey.answers).length} answers across ${sections.length} sections.`);
  for (const readingSection of sections) console.log(`[Cambridge 12 GT] Test ${testNumber} Section ${readingSection.sectionNumber}: ${flattenBookReadingQuestions(readingSection).length} questions, ${readingSection.passages.length} passages.`);
}
for (const testNumber of [5, 6, 7, 8]) {
  const importedParts = manifest.importedSections.filter(entry => entry.testNumber === testNumber && entry.skill === 'listening');
  if (!importedParts.length) continue;
  const folder = `test_${String(testNumber).padStart(2, '0')}`;
  const listening = read<PrivateListeningTest & { schemaVersion: 1 }>(`${folder}/listening.json`);
  const key = read<BookAnswerKey>(`${folder}/listening_answers.json`);
  const questions = listening.parts.flatMap(part => part.questionGroups.flatMap(group => group.questions));
  errors.push(...validateBookAnswerKey(key, questions.map(question => question.number)));
  if (listening.bookId !== manifest.bookId || listening.testNumber !== testNumber || key.testNumber !== testNumber || key.module !== 'listening') errors.push(`Test ${testNumber} Listening identity does not match the manifest.`);
  if (listening.parts.length !== 4 || listening.parts.some((part, index) => part.partNumber !== index + 1)) errors.push(`Test ${testNumber} Listening must contain Parts 1–4 in order.`);
  if (questions.length !== 40 || new Set(questions.map(question => question.number)).size !== 40 || [...questions].map(question => question.number).sort((a,b) => a-b).some((number,index) => number !== index + 1)) errors.push(`Test ${testNumber} Listening must contain exactly Questions 1–40.`);
  for (const part of listening.parts) for (const group of part.questionGroups) {
    if (!group.instructions.trim() || group.questions.length !== group.questionEnd - group.questionStart + 1) errors.push(`Test ${testNumber} Listening Part ${part.partNumber} has an invalid question group.`);
    for (const question of group.questions) {
      if (!question.prompt.trim() || question.type !== group.type || question.sourcePdfPage < 1 || question.printedPage < 1) errors.push(`Test ${testNumber} Listening Question ${question.number} has invalid type, prompt, or source page.`);
    }
    if (['multiple-choice', 'matching'].includes(group.type) && !group.options?.length && !group.questions.every(question => question.options?.length)) errors.push(`Test ${testNumber} Listening Part ${part.partNumber} group ${group.questionStart}–${group.questionEnd} is missing options.`);
    if (group.asset) {
      const assetPrefix = '/api/private-content/cambridge12-gt/assets/';
      const relativeAsset = group.asset.startsWith(assetPrefix) ? group.asset.slice(assetPrefix.length) : '';
      const assetPath = path.resolve(packDir, 'assets', relativeAsset);
      if (!relativeAsset || path.dirname(assetPath) !== path.resolve(packDir, 'assets') || !fs.existsSync(assetPath)) {
        errors.push(`Test ${testNumber} Listening Part ${part.partNumber} group ${group.questionStart}–${group.questionEnd} references a missing or invalid private asset.`);
      }
    }
  }
  for (const part of listening.parts) {
    if (part.audio.status === 'available') {
      const fileName = part.audio.fileName || '';
      const audioDirectory = path.resolve(packDir, folder, 'audio');
      const audioPath = path.resolve(audioDirectory, fileName);
      if (!fileName || path.dirname(audioPath) !== audioDirectory || !fs.existsSync(audioPath)) errors.push(`Test ${testNumber} Listening Part ${part.partNumber} marks audio available but its private audio file is missing or invalid.`);
    } else if (manifest.audioStatus === 'available') {
      errors.push(`Manifest marks Cambridge audio available but Test ${testNumber} Listening Part ${part.partNumber} does not have an available original recording.`);
    }
  }
  const transcriptFile = path.join(packDir, folder, 'transcripts.json');
  if (fs.existsSync(transcriptFile)) {
    const transcripts = read<PrivateListeningTranscripts>(`${folder}/transcripts.json`);
    if (transcripts.bookId !== manifest.bookId || transcripts.testNumber !== testNumber || transcripts.parts.length !== 4 || transcripts.parts.some((part, index) => part.partNumber !== index + 1 || !part.transcript.trim() || part.needsManualReview)) errors.push(`Test ${testNumber} Listening transcripts are missing, out of order, or still need manual review.`);
    for (const part of transcripts.parts) if (part.sourcePdfPages.length === 0 || part.sourcePdfPages.length !== part.printedPages.length || part.sourcePdfPages.some((pdfPage,index) => pdfPage !== part.printedPages[index] + 1)) errors.push(`Test ${testNumber} Listening Part ${part.partNumber} transcript source pages are invalid.`);
    console.log(`[Cambridge 12 GT] Test ${testNumber} Listening transcripts: ${transcripts.parts.length}/4 parts mapped to source pages.`);
  }
  if (importedParts.length !== 4 || importedParts.some((part, index) => part.sectionNumber !== index + 1 || part.questionCount !== 10)) errors.push(`Test ${testNumber} Listening manifest does not list all four 10-question parts.`);
  console.log(`[Cambridge 12 GT] Test ${testNumber} Listening: ${listening.parts.length} parts, ${questions.length} questions and ${Object.keys(key.answers).length} answers.`);
}
if (manifest.importReview?.outstandingIssues !== 0) errors.push('Imported sections still have unresolved issues.');
const questions = flattenBookReadingQuestions(section);
const answerErrors: string[] = [];
const answerPageMap: Record<number, Record<'listening' | 'reading', number>> = {
  5: { listening: 123, reading: 124 }, 6: { listening: 125, reading: 126 },
  7: { listening: 127, reading: 128 }, 8: { listening: 129, reading: 130 }
};
for (const testNumber of [5, 6, 7, 8]) {
  for (const module of ['reading', 'listening'] as const) {
    const file = `test_${String(testNumber).padStart(2, '0')}/${module}_answers.json`;
    const key = read<BookAnswerKey>(file);
    const keyErrors = validateBookAnswerKey(key, Array.from({ length: 40 }, (_, index) => index + 1));
    if (key.testNumber !== testNumber || key.module !== module) keyErrors.push(`Answer key identity mismatch in ${file}.`);
    const expectedPrintedPage = answerPageMap[testNumber]?.[module];
    if (expectedPrintedPage === undefined || key.printedPage !== expectedPrintedPage || key.sourcePdfPage !== expectedPrintedPage + 1) keyErrors.push(`Answer key page mapping mismatch in ${file}.`);
    for (const error of keyErrors) answerErrors.push(`[${file}] ${error}`);
    console.log(`[Cambridge 12 GT] Test ${testNumber} ${module}: ${Object.keys(key.answers).length}/40 answers; answer page ${key.printedPage} (PDF ${key.sourcePdfPage}).`);
  }
}
errors.push(...answerErrors);

const writingPageMap: Record<number, [number, number]> = {
  5: [30, 31], 6: [51, 52], 7: [78, 79], 8: [100, 101]
};
for (const testNumber of [5, 6, 7, 8]) {
  const writing = read<PrivateWritingSection>(`test_${String(testNumber).padStart(2, '0')}/writing.json`);
  const expectedPages = writingPageMap[testNumber];
  if (writing.bookId !== manifest.bookId || writing.testNumber !== testNumber || writing.tasks.length !== 2) errors.push(`Test ${testNumber} Writing identity or task count is invalid.`);
  for (const [index, task] of writing.tasks.entries()) {
    if (task.taskNumber !== index + 1 || !task.prompt.trim()) errors.push(`Test ${testNumber} Writing Task ${index + 1} is missing or out of order.`);
    if (task.sourcePdfPage !== expectedPages[index] || task.printedPage !== expectedPages[index] - 1) errors.push(`Test ${testNumber} Writing Task ${index + 1} page mapping is invalid.`);
    const expectedSamplePdfPage = 132 + (testNumber - 5) * 2 + index;
    const expectedSamplePrintedPage = expectedSamplePdfPage - 1;
    const expectedAsset = `/api/private-content/cambridge12-gt/assets/test-${String(testNumber).padStart(2, '0')}-writing-task-${index + 1}.png`;
    if (task.sampleAnswerSourcePdfPage !== expectedSamplePdfPage || task.sampleAnswerPrintedPage !== expectedSamplePrintedPage || !task.sampleAnswerBand || task.sampleAnswerAsset !== expectedAsset || !fs.existsSync(path.join(packDir, 'assets', path.basename(expectedAsset)))) {
      errors.push(`Test ${testNumber} Writing Task ${index + 1} sample answer metadata or private scan asset is missing or invalid.`);
    }
  }
  console.log(`[Cambridge 12 GT] Test ${testNumber} Writing: ${writing.tasks.length}/2 prompts and sample scans; PDF pages ${expectedPages.join('–')}.`);
}

if (errors.length) {
  console.error('[Cambridge 12 GT] Validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`[Cambridge 12 GT] Pilot Test 5 Section 1: ${questions.length} questions; printed pages ${Math.min(...questions.map(q => q.printedPage))}–${Math.max(...questions.map(q => q.printedPage))}; PDF pages ${Math.min(...questions.map(q => q.sourcePdfPage))}–${Math.max(...questions.map(q => q.sourcePdfPage))}.`);
console.log(`[Cambridge 12 GT] Reviewed source pages: ${manifest.importReview?.reviewedPrintedPages.length}; unresolved issues: ${manifest.importReview?.outstandingIssues}; unsupported layouts: ${manifest.importReview?.unsupportedLayouts.length}.`);
console.log(`[Cambridge 12 GT] Import status: ${manifest.importReview?.status || 'pending'}.`);
console.log('[Cambridge 12 GT] Authentic audio unavailable; status AUDIO_ASSETS_PENDING.');
