import type { VocabCard } from '../../../../types';
import { getRequiredTaskTypes } from './newVocabularyTaskScheduler';
import type { LearningWordState, VocabularySessionMode, VocabularyTaskType } from '../types';
import { createLearningWordState } from '../types';

export function getNewVocabularyCards(cards: VocabCard[]): VocabCard[] {
  return cards.filter(card =>
    card.state === 'new' && card.repetition === 0 &&
    card.word.trim().length > 0 &&
    card.definitionVi.trim().length > 0
  );
}

export function createWordStates(cards: VocabCard[]): Record<string, LearningWordState> {
  return Object.fromEntries(cards.map(card => [card.id, createLearningWordState(card.id)]));
}

export function isWordLearned(card: VocabCard, state: LearningWordState, mode: VocabularySessionMode): boolean {
  if (state.failedTaskTypes.length) return false;
  const required = getRequiredTaskTypes(card, mode);
  return required.every(type => state.completedTaskTypes.includes(type));
}

export function recordLearningTaskResult(
  card: VocabCard,
  state: LearningWordState,
  taskType: VocabularyTaskType,
  correct: boolean,
  questionIndex: number,
  mode: VocabularySessionMode,
): LearningWordState {
  const completed = new Set(state.completedTaskTypes);
  const failed = new Set(state.failedTaskTypes);
  if (correct) {
    completed.add(taskType);
    failed.delete(taskType);
  } else {
    failed.add(taskType);
  }

  let stage = state.stage;
  if (correct && (taskType === 'FLASHCARD' || taskType === 'MCQ_EN_VI' || taskType === 'MCQ_VI_EN')) stage = 'RECOGNIZED';
  if (correct && taskType === 'TYPE_VI_EN') stage = 'RECALLED';
  if (correct && (taskType === 'DEFINITION' || taskType === 'CONTEXT')) stage = 'UNDERSTOOD';

  const nextState: LearningWordState = {
    ...state,
    stage,
    correctCount: state.correctCount + (correct ? 1 : 0),
    wrongCount: state.wrongCount + (correct ? 0 : 1),
    completedTaskTypes: [...completed],
    failedTaskTypes: [...failed],
    lastTaskType: taskType,
    retryAfter: correct || !failed.size ? undefined : questionIndex + 3 + (card.id.charCodeAt(card.id.length - 1) % 3),
  };

  if (isWordLearned(card, nextState, mode)) nextState.stage = 'LEARNED';
  return nextState;
}

export function refillActivePool(
  activeIds: string[],
  selectedCards: VocabCard[],
  states: Record<string, LearningWordState>,
  poolSize: number,
): string[] {
  const learned = new Set(Object.values(states).filter(state => state.stage === 'LEARNED').map(state => state.cardId));
  const next = activeIds.filter(id => !learned.has(id));
  for (const card of selectedCards) {
    if (next.length >= poolSize) break;
    if (!learned.has(card.id) && !next.includes(card.id)) next.push(card.id);
  }
  return next;
}

export function countLearnedWords(states: Record<string, LearningWordState>): number {
  return Object.values(states).filter(state => state.stage === 'LEARNED').length;
}
