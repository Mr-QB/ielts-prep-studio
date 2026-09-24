export interface TypedAnswerResult {
  status: 'CORRECT' | 'SPELLING_ERROR' | 'WRONG';
  similarity: number;
  expected: string;
  received: string;
}

function normalizeAnswer(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9\s'-]/g, '').replace(/[\s'-]+/g, ' ');
}

function editDistance(left: string, right: string): number {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[right.length];
}

export function evaluateTypedAnswer(received: string, expected: string, acceptedAnswers: string[] = []): TypedAnswerResult {
  const receivedNormalized = normalizeAnswer(received);
  const accepted = [expected, ...acceptedAnswers].map(normalizeAnswer).filter(Boolean);
  if (accepted.includes(receivedNormalized)) {
    return { status: 'CORRECT', similarity: 1, expected, received };
  }

  const bestDistance = Math.min(...accepted.map(answer => editDistance(receivedNormalized, answer)));
  const bestLength = Math.max(receivedNormalized.length, ...accepted.map(answer => answer.length));
  const similarity = bestLength ? Math.max(0, 1 - bestDistance / bestLength) : 0;
  const allowedDistance = bestLength >= 10 ? 2 : bestLength >= 5 ? 1 : 0;
  const sameInitial = receivedNormalized[0] === accepted.find(answer => editDistance(receivedNormalized, answer) === bestDistance)?.[0];
  const status = receivedNormalized && bestDistance > 0 && bestDistance <= allowedDistance && sameInitial
    ? 'SPELLING_ERROR'
    : 'WRONG';

  return { status, similarity, expected, received };
}
