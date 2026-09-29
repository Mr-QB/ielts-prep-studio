export interface AptisGradeInput {
  skill: 'reading' | 'listening' | 'speaking' | 'writing';
  part: string;
  content: Record<string, any>;
  answers: Record<string, any>;
}

export function gradeAptisSample(sample: AptisGradeInput, userAnswers: Record<string, string>) {
  if (sample.skill === 'speaking' || sample.skill === 'writing') return null;
  const questions = sample.skill === 'listening' ? sample.content.items ?? [] : sample.content.questions ?? [];
  if (sample.skill === 'reading' && sample.part === '2-3') {
    const sentences = sample.content.sentences_original ?? [];
    const order: number[] = sample.answers.correct_order ?? sentences.map((_: unknown, index: number) => index);
    return { score: Number(sentences.every((sentence: { id: string }, index: number) => Number(userAnswers[sentence.id]) === order.indexOf(index) + 1)), total: 1 };
  }
  const score = questions.reduce((sum: number, question: Record<string, any>, index: number) => {
    const questionId = question.id ?? String(index);
    const expected = sample.skill === 'listening'
      ? question.answerIndex ?? sample.answers[questionId]?.answer_index
      : question.correctParagraphId ?? question.correctAnswer ?? sample.answers[questionId];
    return userAnswers[questionId] !== undefined && userAnswers[questionId] === String(expected) ? sum + 1 : sum;
  }, 0);
  return { score, total: questions.length };
}
