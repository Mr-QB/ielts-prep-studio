import type { BookAnswerKey, BookReadingQuestion, PrivateBookManifest, PrivateListeningTest, PrivateListeningTranscripts, PrivateReadingSection, PrivateWritingSection } from '../types/bookPractice';
import { loadPrivateBookCache, savePrivateBookCache } from './db';
import { gradePrivateAnswers, selectBookAnswerKeyQuestions } from './bookPracticeGrade';

const base = '/api/private-content/cambridge12-gt';

async function readJson<T>(url: string, cacheKey: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if (init?.method === 'POST') throw error;
    const cached = await loadPrivateBookCache<T>(cacheKey);
    if (cached) return cached;
    throw error;
  }
  if (!response.ok) {
    if (response.status >= 500 && init?.method !== 'POST') {
      const cached = await loadPrivateBookCache<T>(cacheKey);
      if (cached) return cached;
    }
    throw new Error(response.status === 404 ? 'Gói nội dung Cambridge chưa được cài đặt trên máy chủ.' : `Không tải được nội dung (${response.status}).`);
  }
  const value = await response.json() as T;
  await savePrivateBookCache(cacheKey, value);
  return value;
}

export const loadCambridgeManifest = () => readJson<PrivateBookManifest>(`${base}/manifest`, 'manifest');
export async function loadCambridgeReadingSection(testNumber: number, sectionNumber: number): Promise<PrivateReadingSection> {
  const section = await readJson<PrivateReadingSection>(`${base}/test/${testNumber}/reading/${sectionNumber}`, `test:${testNumber}:reading:${sectionNumber}`);
  await loadCambridgeReadingAnswerKey(testNumber).catch(() => null);
  return section;
}
export const loadCambridgeReadingAnswerKey = (testNumber: number) =>
  readJson<BookAnswerKey>(`${base}/test/${testNumber}/reading/answer-key`, `test:${testNumber}:reading:answer-key`);
export const loadCambridgeWritingTest = (testNumber: number) =>
  readJson<PrivateWritingSection>(`${base}/test/${testNumber}/writing`, `test:${testNumber}:writing`);
export const loadCambridgeListeningTest = (testNumber: number) =>
  readJson<PrivateListeningTest>(`${base}/test/${testNumber}/listening`, `test:${testNumber}:listening`);
export const loadCambridgeListeningAnswerKey = (testNumber: number) =>
  readJson<BookAnswerKey>(`${base}/test/${testNumber}/listening/answer-key`, `test:${testNumber}:listening:answer-key`);
export const loadCambridgeListeningTranscripts = (testNumber: number) =>
  readJson<PrivateListeningTranscripts>(`${base}/test/${testNumber}/listening/transcripts`, `test:${testNumber}:listening:transcripts`);
type GradeResult = { score: number; total: number; answers: Record<string, string>; correctByQuestion: Record<string, boolean> };

async function gradeWithCachedKey(skill: 'reading' | 'listening', testNumber: number, answers: Record<string, string>, questionNumbers?: number[]): Promise<GradeResult> {
  const key = await loadPrivateBookCache<BookAnswerKey>(`test:${testNumber}:${skill}:answer-key`);
  if (!key) throw new Error('Báº£n chÆ°a táº£i Ä‘Ã¡p Ã¡n khi cÃ²n káº¿t ná»‘i. HÃ£y má»Ÿ bÃ i online má»™t láº§n Ä‘á»ƒ dÃ¹ng khi offline.');
  return gradePrivateAnswers(selectBookAnswerKeyQuestions(key, questionNumbers), answers);
}

async function gradeWithFallback(skill: 'reading' | 'listening', testNumber: number, answers: Record<string, string>, questionNumbers?: number[]): Promise<GradeResult> {
  try {
    return await readJson<GradeResult>(`${base}/test/${testNumber}/${skill}/grade`, `test:${testNumber}:${skill}:grade`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers, questionNumbers })
    });
  } catch (error) {
    const isTransient = error instanceof TypeError || (error instanceof Error && /\((50[0-9]|504)\)/.test(error.message));
    if (!isTransient) throw error;
    return gradeWithCachedKey(skill, testNumber, answers, questionNumbers);
  }
}

export const gradeCambridgeReadingTest = (testNumber: number, answers: Record<string, string>, questionNumbers?: number[]) =>
  gradeWithFallback('reading', testNumber, answers, questionNumbers);
export const gradeCambridgeListeningTest = (testNumber: number, answers: Record<string, string>, questionNumbers?: number[]) =>
  gradeWithFallback('listening', testNumber, answers, questionNumbers);

export { gradePrivateAnswers, selectBookAnswerKeyQuestions };

export function validateBookAnswerKey(answerKey: BookAnswerKey, expectedNumbers?: number[]): string[] {
  const errors: string[] = [];
  const numbers = Object.keys(answerKey.answers).map(Number).sort((a, b) => a - b);
  if (numbers.some(number => !Number.isInteger(number) || number < 1)) errors.push('Answer key contains an invalid question number.');
  if (new Set(numbers).size !== numbers.length) errors.push('Answer key contains duplicate question numbers.');
  const expected = expectedNumbers ? [...expectedNumbers].sort((a, b) => a - b) : numbers;
  if (numbers.length !== expected.length || numbers.some((number, index) => number !== expected[index])) errors.push(`Answer key question numbers do not match the source range (${expected.join(', ')}).`);
  for (const [number, value] of Object.entries(answerKey.answers)) {
    if ((typeof value === 'string' && !value.trim()) || (Array.isArray(value) && (!value.length || value.some(item => !item.trim())))) errors.push(`Answer ${number} is empty.`);
  }
  if (answerKey.sourcePdfPage < 1 || answerKey.printedPage < 1) errors.push('Answer key has invalid source page metadata.');
  for (const constraint of answerKey.constraints || []) {
    if (constraint.questionNumbers.some(number => !expected.includes(number)) || !constraint.acceptableAssignments.length) errors.push('Answer key contains a group constraint without questions or accepted assignments.');
    if (constraint.acceptableAssignments.some(assignment => assignment.length !== constraint.questionNumbers.length || assignment.some(answer => !answer.trim()))) errors.push('Answer key group assignment has an invalid number of answers.');
  }
  return errors;
}

export function validatePrivateReadingSection(section: PrivateReadingSection, answerKey: BookAnswerKey): string[] {
  const errors: string[] = [];
  const numbers = section.questionGroups.flatMap(group => group.questions).map(question => question.number);
  errors.push(...validateBookAnswerKey(answerKey, numbers));
  const questions = section.questionGroups.flatMap(group => group.questions);
  if (numbers.length === 0) errors.push('Section has no questions.');
  if (new Set(numbers).size !== numbers.length) errors.push('Question numbers are duplicated.');
  const sorted = [...numbers].sort((a, b) => a - b);
  if (sorted.some((number, index) => number !== index + sorted[0])) errors.push(`Question numbering is not continuous (questions ${sorted.join(', ')}).`);
  for (const group of section.questionGroups) {
    if (!group.instructions.trim()) errors.push(`Question group ${group.id} has no instructions.`);
    if (!group.questions.length || group.questionStart !== group.questions[0].number || group.questionEnd !== group.questions[group.questions.length - 1].number) {
      errors.push(`Question group ${group.id} has inconsistent question range.`);
    }
  }
  for (const question of questions) {
    if (!question.id || !question.prompt.trim()) errors.push(`Question ${question.number} has no id or prompt.`);
    if (!['true-false-notgiven', 'yes-no-notgiven', 'matching-headings', 'matching-information', 'matching-features', 'matching-sentence-endings', 'multiple-choice', 'sentence-completion', 'summary-completion', 'note-completion', 'table-completion', 'flowchart-completion', 'short-answer', 'diagram-label-completion'].includes(question.type)) errors.push(`Question ${question.number} uses unsupported type ${question.type}.`);
    const group = section.questionGroups.find(item => question.number >= item.questionStart && question.number <= item.questionEnd);
    if (!group) errors.push(`Question ${question.number} is not assigned to a question group.`);
    else if (question.type !== group.type) errors.push(`Question ${question.number} type does not match group ${group.id}.`);
    if (['multiple-choice', 'matching-headings', 'matching-information', 'matching-features', 'matching-sentence-endings'].includes(question.type) && !question.options?.length && !group?.options?.length) errors.push(`Question ${question.number} has no answer options.`);
    const answer = answerKey.answers[String(question.number)];
    if (!answer || (Array.isArray(answer) && !answer.length)) errors.push(`Missing answer for question ${question.number}.`);
    if (question.sourcePdfPage < 1 || question.printedPage < 1) errors.push(`Question ${question.number} has an invalid source page.`);
  }
  const extraAnswers = Object.keys(answerKey.answers).filter(key => !numbers.includes(Number(key)));
  if (extraAnswers.length) errors.push(`Answers exist without questions: ${extraAnswers.join(', ')}.`);
  for (const passage of section.passages) {
    if (!passage.text.trim()) errors.push(`Passage ${passage.id} is empty.`);
    if (passage.sourcePdfPage < 1 || passage.printedPage < 1) errors.push(`Passage ${passage.id} has invalid page metadata.`);
  }
  return errors;
}

export const flattenBookReadingQuestions = (section: PrivateReadingSection): BookReadingQuestion[] =>
  section.questionGroups.flatMap(group => group.questions);
