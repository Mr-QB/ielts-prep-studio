export function isMistakeDue(status: string | undefined, nextRetryDate: string | undefined, today: string): boolean {
  return status !== 'mastered' && (!nextRetryDate || nextRetryDate <= today);
}

export function countMistakesMasteredBetween(
  mistakes: { masteredAt?: string }[],
  fromDate: string,
  throughDate: string,
): number {
  const start = new Date(`${fromDate}T00:00:00`).getTime();
  const end = new Date(`${throughDate}T23:59:59.999`).getTime();
  return mistakes.filter(mistake => {
    if (!mistake.masteredAt) return false;
    const time = new Date(mistake.masteredAt).getTime();
    return Number.isFinite(time) && time >= start && time <= end;
  }).length;
}

export function isMistakeAnswerCorrect(input: string, expected: string): boolean {
  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const answer = normalize(input);
  return Boolean(answer) && expected.split(/\s+\/\s+|\s*;\s*/).some(option => normalize(option) === answer);
}

/** Match the value submitted by the Cambridge player, not its display label. */
export function mistakeOptionValue(option: string): string {
  return option.match(/^([A-I])(?:[.)]|\s)/i)?.[1]?.toUpperCase() ?? option;
}

export function nextMistakeRetryDays(retryCount: number, isCorrect: boolean, consecutiveCorrect: number): number | null {
  if (isCorrect && consecutiveCorrect >= 2) return null;
  if (isCorrect) return 3;
  return retryCount <= 1 ? 1 : retryCount === 2 ? 3 : 7;
}
