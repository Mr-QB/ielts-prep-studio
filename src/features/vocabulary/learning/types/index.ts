import type { VocabCard } from '../../../../types';

export type VocabularyTaskType = 'FLASHCARD' | 'MCQ_EN_VI' | 'MCQ_VI_EN' | 'TYPE_VI_EN' | 'DEFINITION' | 'CONTEXT';
export type VocabularySessionMode = 'QUICK' | 'DEEP';
export type LearningStage = 'NEW' | 'RECOGNIZED' | 'RECALLED' | 'UNDERSTOOD' | 'LEARNED';

export interface LearningWordState {
  cardId: string;
  stage: LearningStage;
  correctCount: number;
  wrongCount: number;
  completedTaskTypes: VocabularyTaskType[];
  failedTaskTypes: VocabularyTaskType[];
  lastTaskType?: VocabularyTaskType;
  retryAfter?: number;
}

export interface VocabularyLearningTask {
  card: VocabCard;
  taskType: VocabularyTaskType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  contextBefore?: string;
  contextAfter?: string;
  retry?: boolean;
}

export interface TaskRequest {
  cards: VocabCard[];
  activeCardIds: string[];
  states: Record<string, LearningWordState>;
  sessionMode: VocabularySessionMode;
  questionIndex: number;
  previousCardId?: string;
}

export function createLearningWordState(cardId: string): LearningWordState {
  return { cardId, stage: 'NEW', correctCount: 0, wrongCount: 0, completedTaskTypes: [], failedTaskTypes: [] };
}
