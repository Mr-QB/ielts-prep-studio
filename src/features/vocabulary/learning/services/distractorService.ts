import type { VocabCard } from '../../../../types';

const confusionGroups = [
  ['significant', 'important', 'considerable', 'noticeable', 'ordinary'],
  ['increase', 'rise', 'grow', 'decrease', 'decline', 'fall'],
  ['affect', 'effect', 'impact', 'influence'],
  ['economic', 'economical', 'financial'],
];

const clean = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
const posHead = (value: string) => value.split(/[|,/;]/, 1)[0].trim().toLowerCase();
const tokens = (value: string) => new Set(value.toLowerCase().match(/[a-z]{3,}/g) || []);

function semanticOverlap(left: VocabCard, right: VocabCard): number {
  const leftTokens = tokens(`${left.definitionVi} ${left.definitionEn} ${left.category}`);
  const rightTokens = tokens(`${right.definitionVi} ${right.definitionEn} ${right.category}`);
  let shared = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) shared += 1;
  return shared;
}

function confusionScore(left: VocabCard, right: VocabCard): number {
  const a = clean(left.word);
  const b = clean(right.word);
  return confusionGroups.some(group => group.includes(a) && group.includes(b)) ? 5 : 0;
}

function rankCandidates(target: VocabCard, candidates: VocabCard[]): VocabCard[] {
  return candidates
    .filter(candidate => candidate.id !== target.id && candidate.word.trim() && candidate.definitionVi.trim())
    .map(candidate => ({
      candidate,
      score:
        (posHead(candidate.partOfSpeech) === posHead(target.partOfSpeech) ? 8 : 0) +
        (candidate.bandLevel && candidate.bandLevel === target.bandLevel ? 4 : 0) +
        (candidate.topicTheme && candidate.topicTheme === target.topicTheme ? 3 : 0) +
        (candidate.category && candidate.category === target.category ? 2 : 0) +
        semanticOverlap(target, candidate) + confusionScore(target, candidate),
    }))
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
    .map(item => item.candidate);
}

function stableShuffle<T>(items: T[], seed: string): T[] {
  const hash = [...seed].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
  return items
    .map((item, index) => ({ item, key: (hash ^ Math.imul(index + 1, 2654435761)) >>> 0 }))
    .sort((a, b) => a.key - b.key)
    .map(entry => entry.item);
}

/** Chooses relevant distractors from the same selected vocabulary source. */
export function getVocabularyDistractors(
  target: VocabCard,
  cards: VocabCard[],
  direction: 'EN_VI' | 'VI_EN',
  count = 3,
): string[] {
  const answer = direction === 'EN_VI' ? target.definitionVi : target.word;
  const seen = new Set([clean(answer)]);
  const distractors: string[] = [];
  for (const card of rankCandidates(target, cards)) {
    const option = direction === 'EN_VI' ? card.definitionVi : card.word;
    const normalized = clean(option);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    distractors.push(option.trim());
    if (distractors.length === count) break;
  }
  return stableShuffle([answer, ...distractors], `${target.id}-${direction}`);
}

/** Applies deterministic relevant distractor ranking to English-definition choices. */
export function getDefinitionDistractors(target: VocabCard, cards: VocabCard[], count = 3): string[] {
  const answer = target.word;
  const seen = new Set([clean(answer)]);
  const options = [answer];
  for (const card of rankCandidates(target, cards)) {
    if (!card.definitionEn.trim()) continue;
    const value = card.word.trim();
    if (seen.has(clean(value))) continue;
    seen.add(clean(value));
    options.push(value);
    if (options.length > count) break;
  }
  return stableShuffle(options, `${target.id}-DEFINITION`);
}
