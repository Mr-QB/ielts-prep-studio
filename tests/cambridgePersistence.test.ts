import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { addWordToVocabDeck, fetchCurrentUser, getLearnerVocabDecks, loadAttemptsFromStorage, loadDecksFromStorage, loadMistakes, recordAttempt, saveDecksToStorage, savePrivateBookCache, loadPrivateBookCache, setActiveUser, loadLearningPosition, saveLearningPosition, loadCambridgePracticeDraft, saveCambridgePracticeDraft, loadCambridgeWritingWork, saveCambridgeWritingWork, loadStudyPlanSettings, saveStudyPlanSettings, loadVocabularyLearningSession, saveVocabularyLearningSession, clearVocabularyLearningSession } from '../src/utils/db';
import { gradeCambridgeReadingTest } from '../src/utils/bookPractice';
import type { TestAttempt, UserProfile, VocabDeck } from '../src/types';

test('hides built-in vocabulary while preserving learner cards stored in starter decks', () => {
  const starter = {
    id: 'core-band-4-5', name: 'Starter', description: '', createdAt: '', source: 'starter',
    cards: [
      { id: 'v-core-1', word: 'seed' },
      { id: 'vocab-old-user-card', word: 'personally saved' },
    ] as VocabDeck['cards'],
  };
  const visible = getLearnerVocabDecks([starter]);
  assert.deepEqual(visible.flatMap(deck => deck.cards.map(card => card.word)), ['personally saved']);
  assert.equal(starter.cards.length, 2, 'filtering does not modify the stored starter deck');
});

test('persists private reading attempts, mistakes, vocabulary sources, and user-isolated cache in IndexedDB', async () => {
  const descriptors = {
    window: Object.getOwnPropertyDescriptor(globalThis, 'window'),
    navigator: Object.getOwnPropertyDescriptor(globalThis, 'navigator'),
    localStorage: Object.getOwnPropertyDescriptor(globalThis, 'localStorage'),
    fetch: Object.getOwnPropertyDescriptor(globalThis, 'fetch')
  };
  const local = new Map<string, string>();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { indexedDB: globalThis.indexedDB } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: false } });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => local.get(key) || null,
    setItem: (key: string, value: string) => { local.set(key, value); },
    removeItem: (key: string) => { local.delete(key); }
  } });
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => new Response('{}', { status: 401 }) });

  try {
    const user: UserProfile = { id: 'synthetic-user-a', email: 'a@example.test', displayName: 'A', currentBand: 5, targetBand: 7, dailyStudyMinutes: 30 };
    setActiveUser(user);
    const deck: VocabDeck = { id: 'synthetic-deck', name: 'Personal', description: 'Synthetic', createdAt: new Date().toISOString(), source: 'test', cards: [] };
    await saveDecksToStorage([deck]);
    const vocab = await addWordToVocabDeck({
      word: 'luminous', definitionVi: 'phát sáng', definitionEn: 'giving off light', example: 'A luminous sign.',
      source: 'Cambridge IELTS 12 GT · Test 5 · Reading Section 1', sourceType: 'reading',
      sourcePackId: 'cambridge12-gt', sourceTestNumber: 5, sourceSectionNumber: 1,
      sourceContext: 'A luminous sign was visible from the path.'
    });
    assert.equal(vocab.success, true);
    const savedDecks = await loadDecksFromStorage([]);
    assert.equal(savedDecks[0].cards[0].sourcePackId, 'cambridge12-gt');
    assert.equal(savedDecks[0].cards[0].sourceTestNumber, 5);
    assert.match(savedDecks[0].cards[0].sourceContext || '', /luminous sign/);

    const attempt: TestAttempt = {
      id: 'synthetic-cambridge-attempt', examFamily: 'ielts', source: 'cambridge12-gt', sourcePackId: 'cambridge12-gt',
      module: 'reading', bookId: 'cambridge12-gt', testNumber: 5,
      skill: 'reading', sectionId: 'synthetic-section', sectionTitle: 'Synthetic reading section',
      date: new Date().toISOString(), score: 0, total: 1, durationSeconds: 10, mode: 'study',
      userAnswers: { '1': 'FALSE' }, incorrectQuestionNumbers: [1],
      mistakeTags: [{ questionNumber: 21, sectionNumber: 2, type: 'note-completion', userAnswer: 'average', correctAnswer: 'self-employed', questionPrompt: 'Employment status: _____', options: ['average', 'self-employed'], sourcePage: 23, sourcePdfPage: 24 }],
      questionResults: [{ questionNumber: 21, sectionNumber: 2, questionType: 'note-completion', userAnswer: 'average', correctAnswer: 'self-employed', isCorrect: false, printedPage: 23, sourcePdfPage: 24 }]
    };
    await recordAttempt(attempt);
    const restored = await loadAttemptsFromStorage();
    assert.equal(restored[0].sourcePackId, 'cambridge12-gt');
    assert.equal(restored[0].questionResults?.[0].isCorrect, false);
    assert.equal(restored[0].questionResults?.[0].sectionNumber, 2);
    const mistakes = await loadMistakes();
    assert.equal(mistakes[0].testNumber, 5);
    assert.equal(mistakes[0].sectionNumber, 2);
    assert.equal(mistakes[0].sourcePdfPage, 24);
    assert.equal(mistakes[0].sourcePackId, 'cambridge12-gt');
    assert.equal(mistakes[0].questionPrompt, 'Employment status: _____');
    assert.deepEqual(mistakes[0].options, ['average', 'self-employed']);
    assert.equal(mistakes[0].status, 'new');
    assert.equal(mistakes[0].retryCount, 0);
    assert.equal(mistakes[0].consecutiveCorrect, 0);

    await savePrivateBookCache('test:5:reading:1', { source: 'synthetic' });
    assert.deepEqual(await loadPrivateBookCache('test:5:reading:1'), { source: 'synthetic' });
    await savePrivateBookCache('test:5:reading:answer-key', {
      schemaVersion: 1, testNumber: 5, module: 'reading', sourcePdfPage: 125, printedPage: 124,
      answers: { '1': 'B', '2': 'A' }
    });
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => { throw new TypeError('Failed to fetch'); } });
    assert.deepEqual(await gradeCambridgeReadingTest(5, { '1': 'B', '2': 'C' }, [1, 2]), {
      score: 1, total: 2, answers: { '1': 'B', '2': 'A' }, correctByQuestion: { '1': true, '2': false }
    }, 'cached private answer keys grade offline attempts');
    await saveLearningPosition({ sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading', sectionNumber: 2, updatedAt: new Date().toISOString() });
    assert.equal((await loadLearningPosition())?.sectionNumber, 2);
    await saveCambridgePracticeDraft({ id: 'test-5-reading-2', testNumber: 5, module: 'reading', sectionNumber: 2, answers: { '15': 'draft answer' }, updatedAt: new Date().toISOString() });
    assert.equal((await loadCambridgePracticeDraft('test-5-reading-2'))?.answers['15'], 'draft answer');
    await saveCambridgeWritingWork({ id: 'test-5-task-1', testNumber: 5, taskNumber: 1, draft: 'My response', updatedAt: new Date().toISOString() });
    assert.equal((await loadCambridgeWritingWork())['test-5-task-1'].draft, 'My response');
    await saveStudyPlanSettings({ id: 'current', weeklyAvailability: [{ weekday: 1, start: '19:00', end: '21:00' }], intensity: 'normal', planStartDate: '2026-09-01', updatedAt: new Date().toISOString() });
    assert.equal((await loadStudyPlanSettings())?.weeklyAvailability[0].weekday, 1);
    const learningSession = { sourceDeckId: 'synthetic-deck', session: { questionIndex: 4, finished: false, states: { 'vocab-one': { stage: 'RECALLED' } } } };
    await saveVocabularyLearningSession(learningSession);
    assert.deepEqual(await loadVocabularyLearningSession(), learningSession);
    setActiveUser({ ...user, id: 'synthetic-user-b' });
    assert.equal(await loadPrivateBookCache('test:5:reading:1'), null);
    assert.equal(await loadLearningPosition(), null);
    assert.equal(await loadCambridgePracticeDraft('test-5-reading-2'), null);
    assert.deepEqual(await loadCambridgeWritingWork(), {});
    assert.equal(await loadStudyPlanSettings(), null);
    assert.equal(await loadVocabularyLearningSession(), null, 'a second learner cannot read another learner’s active vocabulary session');
    setActiveUser(user);
    await clearVocabularyLearningSession();
    assert.equal(await loadVocabularyLearningSession(), null);
  } finally {
    setActiveUser(null);
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});

test('sync responses and cursors stay namespaced when the active account changes mid-request', async () => {
  const descriptors = {
    window: Object.getOwnPropertyDescriptor(globalThis, 'window'),
    navigator: Object.getOwnPropertyDescriptor(globalThis, 'navigator'),
    localStorage: Object.getOwnPropertyDescriptor(globalThis, 'localStorage'),
    fetch: Object.getOwnPropertyDescriptor(globalThis, 'fetch')
  };
  const local = new Map<string, string>();
  const userA: UserProfile = { id: 'sync-user-a', email: 'sync-a@example.test', displayName: 'A', currentBand: 5, targetBand: 7, dailyStudyMinutes: 30 };
  const userB: UserProfile = { ...userA, id: 'sync-user-b', email: 'sync-b@example.test', displayName: 'B' };
  let authUser = userA;
  let releasePullA!: (response: Response) => void;
  let markPullAStarted!: () => void;
  let markPullBStarted!: (cursor: string) => void;
  const delayedPullA = new Promise<Response>(resolve => { releasePullA = resolve; });
  const pullAStarted = new Promise<void>(resolve => { markPullAStarted = resolve; });
  const pullBStarted = new Promise<string>(resolve => { markPullBStarted = resolve; });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { indexedDB: globalThis.indexedDB, setTimeout } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => local.get(key) || null,
    setItem: (key: string, value: string) => { local.set(key, value); },
    removeItem: (key: string) => { local.delete(key); }
  } });
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async (input: RequestInfo | URL) => {
    const url = new URL(String(input), 'http://localhost');
    if (url.pathname === '/api/auth/me') return new Response(JSON.stringify({ success: true, user: authUser }));
    if (url.pathname === '/api/sync/push') return new Response(JSON.stringify({ acceptedIds: [] }));
    if (url.pathname === '/api/sync/pull' && authUser.id === userA.id) {
      markPullAStarted();
      return delayedPullA;
    }
    if (url.pathname === '/api/sync/pull' && authUser.id === userB.id) {
      markPullBStarted(url.searchParams.get('cursor') || '0');
      return new Response(JSON.stringify({ changes: [], cursor: 0 }));
    }
    return new Response('{}', { status: 404 });
  } });

  try {
    const positionA = { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading' as const, sectionNumber: 2, updatedAt: '2026-09-29T00:00:00.000Z' };
    const loadingA = fetchCurrentUser();
    await pullAStarted;
    authUser = userB;
    setActiveUser(userB);
    releasePullA(new Response(JSON.stringify({
      changes: [{ id: 'sync-user-a:learning_position:current', changeId: 'remote-a', userId: userA.id, entity: 'learning_position', recordId: 'current', operation: 'upsert', payload: positionA, updatedAt: 100 }],
      cursor: 17
    })));
    await loadingA;
    const userBCursor = await pullBStarted;
    assert.equal(userBCursor, '0', 'account B must not inherit account A\'s pull cursor');
    setActiveUser(userA);
    assert.deepEqual(await loadLearningPosition(), positionA, 'the remote update is stored under the account that requested it');
    setActiveUser(userB);
    assert.equal(await loadLearningPosition(), null, 'account B cannot read account A\'s remote update');
  } finally {
    setActiveUser(null);
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
