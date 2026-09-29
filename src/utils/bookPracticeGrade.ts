import type { BookAnswerKey } from '../types/bookPractice';

export interface PrivateGradeResult {
  score: number;
  total: number;
  answers: Record<string, string>;
  correctByQuestion: Record<string, boolean>;
}

export function readingChoiceValue(option: string): string {
  const trimmed = option.trim();
  return trimmed.match(/^([A-Z0-9])(?:[.)]|\s|$)/i)?.[1] ?? trimmed;
}

export function gradePrivateAnswers(answerKey: BookAnswerKey, userAnswers: Record<string, string>): PrivateGradeResult {
  const answers: Record<string, string> = {};
  const correctByQuestion: Record<string, boolean> = {};
  const constrainedNumbers = new Set(answerKey.constraints?.flatMap(group => group.questionNumbers) || []);
  let score = 0;

  for (const [number, value] of Object.entries(answerKey.answers)) {
    const accepted = Array.isArray(value) ? value : [value];
    answers[number] = accepted.join(' / ');
    if (constrainedNumbers.has(Number(number))) continue;
    const correct = accepted.some(answer => answer.trim().toUpperCase() === (userAnswers[number] || '').trim().toUpperCase());
    correctByQuestion[number] = correct;
    if (correct) score += 1;
  }

  for (const constraint of answerKey.constraints || []) {
    for (const number of constraint.questionNumbers) {
      answers[String(number)] = [...new Set(constraint.acceptableAssignments.map(row => row[constraint.questionNumbers.indexOf(number)]))].join(' / ');
    }
    let best = -1;
    let bestAssignment = constraint.acceptableAssignments[0];
    for (const assignment of constraint.acceptableAssignments) {
      const matches = assignment.reduce((count, expected, index) => count + ((userAnswers[String(constraint.questionNumbers[index])] || '').trim().toUpperCase() === expected.trim().toUpperCase() ? 1 : 0), 0);
      if (matches > best) { best = matches; bestAssignment = assignment; }
    }
    constraint.questionNumbers.forEach((number, index) => {
      correctByQuestion[String(number)] = (userAnswers[String(number)] || '').trim().toUpperCase() === bestAssignment[index].trim().toUpperCase();
    });
    score += best;
  }
  return { score, total: Object.keys(answerKey.answers).length, answers, correctByQuestion };
}

export function selectBookAnswerKeyQuestions(answerKey: BookAnswerKey, questionNumbers?: number[]): BookAnswerKey {
  if (!questionNumbers?.length) return answerKey;
  const selected = new Set(questionNumbers);
  return {
    ...answerKey,
    answers: Object.fromEntries(Object.entries(answerKey.answers).filter(([number]) => selected.has(Number(number)))),
    constraints: answerKey.constraints?.filter(group => group.questionNumbers.every(number => selected.has(number)))
  };
}
