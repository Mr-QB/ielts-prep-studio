import type { VocabCard } from '../../../../types';
import { getDefinitionDistractors, getVocabularyDistractors } from './distractorService';
import type { LearningWordState, TaskRequest, VocabularyLearningTask, VocabularyTaskType } from '../types';

const flashcard: VocabularyTaskType = 'FLASHCARD';

export function getRequiredTaskTypes(card: VocabCard, mode: TaskRequest['sessionMode']): VocabularyTaskType[] {
  const tasks: VocabularyTaskType[] = ['MCQ_EN_VI', 'MCQ_VI_EN'];
  if (mode === 'DEEP') {
    tasks.push('TYPE_VI_EN');
    if (getCloze(card)) tasks.push('CONTEXT');
    else if (card.definitionEn?.trim()) tasks.push('DEFINITION');
  }
  return tasks;
}

function getCloze(card: VocabCard): { before: string; after: string } | undefined {
  const sentence = card.example?.trim() || card.sourceContext?.trim();
  if (!sentence || !card.word.trim()) return undefined;
  const escaped = card.word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`\\b${escaped}\\b`, 'i').exec(sentence);
  if (!match || match.index === undefined) return undefined;
  return { before: sentence.slice(0, match.index), after: sentence.slice(match.index + match[0].length) };
}

function createTask(card: VocabCard, taskType: VocabularyTaskType, cards: VocabCard[], retry = false): VocabularyLearningTask {
  switch (taskType) {
    case 'FLASHCARD':
      return { card, taskType, prompt: 'Thử nhớ nghĩa và cách dùng trước khi lật thẻ.', correctAnswer: card.definitionVi, retry };
    case 'MCQ_EN_VI':
      return { card, taskType, prompt: 'Chọn nghĩa tiếng Việt phù hợp.', options: getVocabularyDistractors(card, cards, 'EN_VI'), correctAnswer: card.definitionVi, retry };
    case 'MCQ_VI_EN':
      return { card, taskType, prompt: 'Chọn từ tiếng Anh tương ứng.', options: getVocabularyDistractors(card, cards, 'VI_EN'), correctAnswer: card.word, retry };
    case 'TYPE_VI_EN':
      return { card, taskType, prompt: 'Gõ từ tiếng Anh từ gợi nghĩa.', correctAnswer: card.word, retry };
    case 'DEFINITION':
      return { card, taskType, prompt: 'Which word matches this definition?', options: getDefinitionDistractors(card, cards), correctAnswer: card.word, retry };
    case 'CONTEXT': {
      const cloze = getCloze(card);
      if (!cloze) throw new Error('Cannot create a context task without the target word in the sentence.');
      return { card, taskType, prompt: 'Chọn từ phù hợp để hoàn thành câu.', options: getVocabularyDistractors(card, cards, 'VI_EN'), correctAnswer: card.word, ...cloze, retry };
    }
  }
}

function nextTaskType(card: VocabCard, state: LearningWordState, mode: TaskRequest['sessionMode']): VocabularyTaskType | undefined {
  if (!state.completedTaskTypes.includes(flashcard)) return flashcard;
  return getRequiredTaskTypes(card, mode).find(type => !state.completedTaskTypes.includes(type));
}

function rotateIds(ids: string[], previousId?: string): string[] {
  if (ids.length < 2 || !previousId) return ids;
  const index = ids.indexOf(previousId);
  if (index < 0) return ids;
  return [...ids.slice(index + 1), ...ids.slice(0, index + 1)];
}

export function getNextLearningTask(request: TaskRequest): VocabularyLearningTask | undefined {
  const cardsById = new Map(request.cards.map(card => [card.id, card]));
  const ids = request.activeCardIds.filter(id => cardsById.has(id) && request.states[id]?.stage !== 'LEARNED');
  if (!ids.length) return undefined;
  const order = rotateIds(ids, request.previousCardId);
  const eligibleRetry = order
    .map(id => ({ id, state: request.states[id], card: cardsById.get(id)! }))
    .find(item => item.state.failedTaskTypes.length && (item.state.retryAfter ?? 0) <= request.questionIndex);
  if (eligibleRetry) {
    const taskType = eligibleRetry.state.failedTaskTypes[0];
    return createTask(eligibleRetry.card, taskType, request.cards, true);
  }

  const available = order
    .map(id => ({ id, state: request.states[id], card: cardsById.get(id)! }))
    .filter(item => !item.state.failedTaskTypes.length && nextTaskType(item.card, item.state, request.sessionMode));
  const selected = available[0];
  if (selected) {
    return createTask(selected.card, nextTaskType(selected.card, selected.state, request.sessionMode)!, request.cards);
  }

  // If all remaining work is waiting on a retry, don't stall the session.
  const pending = order
    .map(id => ({ state: request.states[id], card: cardsById.get(id)! }))
    .find(item => item.state.failedTaskTypes.length);
  if (pending) return createTask(pending.card, pending.state.failedTaskTypes[0], request.cards, true);
  return undefined;
}
