import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { VocabCard } from '../src/types';
import { getDefinitionDistractors, getVocabularyDistractors } from '../src/features/vocabulary/learning/services/distractorService';
import { countLearnedWords, createWordStates, getNewVocabularyCards, isWordLearned, recordLearningTaskResult, refillActivePool } from '../src/features/vocabulary/learning/services/learningSessionService';
import { getNextLearningTask, getRequiredTaskTypes } from '../src/features/vocabulary/learning/services/newVocabularyTaskScheduler';
import { evaluateTypedAnswer } from '../src/features/vocabulary/learning/services/typedAnswerEvaluator';
import type { LearningWordState, VocabularyTaskType } from '../src/features/vocabulary/learning/types';

function card(id: string, overrides: Partial<VocabCard> = {}): VocabCard {
  return {
    id, word: id, phonetic: '', partOfSpeech: 'adjective', definitionVi: `nghĩa ${id}`,
    definitionEn: `a meaning for ${id}`, example: `A ${id} example.`, category: 'Academic',
    repetition: 0, intervalDays: 0, easeFactor: 2.5, dueDate: '', state: 'new', ...overrides,
  };
}

describe('new vocabulary learning engine', () => {
  it('limits the active pool and refills it when a word is learned', () => {
    const cards = Array.from({ length: 20 }, (_, index) => card(`word-${index}`));
    const states = createWordStates(cards);
    const active = refillActivePool([], cards, states, 5);
    assert.equal(active.length, 5);
    states[active[2]].stage = 'LEARNED';
    const refilled = refillActivePool(active, cards, states, 5);
    assert.equal(refilled.length, 5);
    assert.ok(refilled.includes('word-5'));
    assert.ok(!refilled.includes(active[2]));
  });

  it('offers the correct translation exactly once in both recognition directions', () => {
    const cards = [card('significant', { word: 'significant', definitionVi: 'đáng kể', topicTheme: 'Education' }), card('important', { word: 'important', definitionVi: 'quan trọng', topicTheme: 'Education' }), card('ordinary', { word: 'ordinary', definitionVi: 'bình thường', topicTheme: 'Education' })];
    for (const direction of ['EN_VI', 'VI_EN'] as const) {
      const answer = direction === 'EN_VI' ? 'đáng kể' : 'significant';
      const options = getVocabularyDistractors(cards[0], cards, direction);
      assert.equal(options.filter(option => option === answer).length, 1);
      assert.equal(new Set(options.map(option => option.toLowerCase())).size, options.length);
    }
  });

  it('uses same-source distractors and does not duplicate the target card', () => {
    const cards = [card('significant'), card('significant-copy', { word: 'significant' }), card('important'), card('noticeable'), card('unrelated', { partOfSpeech: 'noun', category: 'Other' })];
    const distractors = getDefinitionDistractors(cards[0], cards);
    assert.equal(distractors.filter(value => value === 'significant').length, 1);
    assert.equal(new Set(distractors.map(value => value.toLowerCase())).size, distractors.length);
    const viable = getNewVocabularyCards(cards);
    assert.equal(viable.length, cards.length);
  });

  it('classifies exact typing, a near spelling, and an unrelated answer separately', () => {
    assert.equal(evaluateTypedAnswer('significant', 'significant').status, 'CORRECT');
    assert.equal(evaluateTypedAnswer('enviroment', 'environment').status, 'SPELLING_ERROR');
    assert.equal(evaluateTypedAnswer('banana', 'environment').status, 'WRONG');
  });

  it('distinguishes a wrong word form and an incomplete phrase from spelling mistakes', () => {
    assert.equal(evaluateTypedAnswer('significance', 'significant').status, 'MORPHOLOGY_ERROR');
    assert.equal(evaluateTypedAnswer('students', 'student').status, 'MORPHOLOGY_ERROR');
    assert.equal(evaluateTypedAnswer('take into', 'take into account').status, 'INCOMPLETE_PHRASE');
    assert.equal(evaluateTypedAnswer('take banana', 'take into account').status, 'WRONG');
    assert.equal(evaluateTypedAnswer('studebts', 'students').status, 'SPELLING_ERROR');
    assert.equal(evaluateTypedAnswer('', '').status, 'WRONG');
  });

  it('does not mark a deep word learned after one correct MCQ', () => {
    const target = card('significant');
    let state = createWordStates([target])[target.id];
    state = recordLearningTaskResult(target, state, 'FLASHCARD', true, 0, 'DEEP');
    state = recordLearningTaskResult(target, state, 'MCQ_EN_VI', true, 1, 'DEEP');
    assert.equal(state.stage, 'RECOGNIZED');
    assert.equal(isWordLearned(target, state, 'DEEP'), false);
    assert.equal(countLearnedWords({ [target.id]: state }), 0);
  });

  it('allows a quick word to be learned only after both directions are answered correctly', () => {
    const target = card('steady');
    let state = createWordStates([target])[target.id];
    state = recordLearningTaskResult(target, state, 'FLASHCARD', true, 0, 'QUICK');
    state = recordLearningTaskResult(target, state, 'MCQ_EN_VI', true, 1, 'QUICK');
    assert.equal(isWordLearned(target, state, 'QUICK'), false);
    state = recordLearningTaskResult(target, state, 'MCQ_VI_EN', true, 2, 'QUICK');
    assert.equal(state.stage, 'LEARNED');
  });

  it('requires recognition, reverse recognition, typing and one available context or definition in deep mode', () => {
    const target = card('environment');
    assert.deepEqual(getRequiredTaskTypes(target, 'DEEP'), ['MCQ_EN_VI', 'MCQ_VI_EN', 'TYPE_VI_EN', 'CONTEXT']);
    let state: LearningWordState = createWordStates([target])[target.id];
    for (const type of ['FLASHCARD', 'MCQ_EN_VI', 'MCQ_VI_EN', 'TYPE_VI_EN', 'CONTEXT'] as const) {
      state = recordLearningTaskResult(target, state, type, true, 0, 'DEEP');
    }
    assert.equal(state.stage, 'LEARNED');
    assert.equal(isWordLearned(target, state, 'DEEP'), true);
  });

  it('skips definition and context tasks when source fields are missing or do not contain the word', () => {
    const target = card('environment', { definitionEn: '', example: 'People need to protect the planet.' });
    assert.ok(!getRequiredTaskTypes(target, 'DEEP').includes('DEFINITION'));
    assert.ok(!getRequiredTaskTypes(target, 'DEEP').includes('CONTEXT'));
  });

  it('defers a failed task until other active words have had a turn', () => {
    const cards = Array.from({ length: 5 }, (_, index) => card(`word-${index}`));
    const states = createWordStates(cards);
    states['word-0'] = { ...states['word-0'], completedTaskTypes: ['FLASHCARD'], failedTaskTypes: ['MCQ_EN_VI'], retryAfter: 5 };
    states['word-1'] = { ...states['word-1'], completedTaskTypes: ['FLASHCARD'] };
    const task = getNextLearningTask({ cards, activeCardIds: cards.map(item => item.id), states, sessionMode: 'DEEP', questionIndex: 1, previousCardId: 'word-0' });
    assert.equal(task?.card.id, 'word-1');
    assert.notEqual(task?.card.id, 'word-0');
  });

  it('requeues a failed task after a short question delay', () => {
    const target = card('environment');
    const other = card('ordinary');
    let state: LearningWordState = { ...createWordStates([target])[target.id], completedTaskTypes: ['FLASHCARD', 'MCQ_EN_VI', 'MCQ_VI_EN', 'TYPE_VI_EN'] as VocabularyTaskType[] };
    state = recordLearningTaskResult(target, state, 'CONTEXT', false, 2, 'DEEP');
    const otherState = { ...createWordStates([other])[other.id], completedTaskTypes: ['FLASHCARD'] as VocabularyTaskType[] };
    const request = { cards: [target, other], activeCardIds: [target.id, other.id], states: { [target.id]: state, [other.id]: otherState }, sessionMode: 'DEEP' as const, previousCardId: target.id };
    assert.equal(getNextLearningTask({ ...request, questionIndex: 3 })?.card.id, other.id);
    assert.equal(getNextLearningTask({ ...request, questionIndex: 6 })?.card.id, other.id);
    assert.equal(getNextLearningTask({ ...request, questionIndex: 7 })?.retry, true);
    assert.equal(getNextLearningTask({ ...request, questionIndex: 7 })?.taskType, 'CONTEXT');
  });
});
