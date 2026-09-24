/**
 * Rigorous Two-User Isolation Verification Script
 * Validates complete separation of SRS state, custom vocabulary,
 * attempts, mistakes, grammar progress, and daily protocols.
 */

const BASE_URL = 'http://127.0.0.1:8085';

interface ApiResponse<T = any> {
  success?: boolean;
  user?: any;
  decks?: any[];
  attempts?: any[];
  mistakes?: any[];
  progress?: Record<string, string>;
  record?: any;
  changes?: any[];
  error?: string;
}

class UserClient {
  public cookie: string = '';
  public email: string;
  public pass: string;
  public userId: string = '';

  constructor(email: string, pass: string) {
    this.email = email;
    this.pass = pass;
  }

  async login(): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, password: this.pass })
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }
    const data = await res.json() as ApiResponse;
    if (!res.ok || !data.success) {
      throw new Error(`Login failed for ${this.email}: ${JSON.stringify(data)}`);
    }
    this.userId = data.user.id;
    return data.user;
  }

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: this.cookie }
    });
    this.cookie = '';
  }

  async get(path: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: { Cookie: this.cookie }
    });
    return res.json();
  }

  async post(path: string, body: any): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: this.cookie },
      body: JSON.stringify(body)
    });
    return res.json();
  }
}

async function runTwoUserTest() {
  console.log('========================================================');
  console.log(' STARTING TWO-USER DATA ISOLATION VERIFICATION SUITE    ');
  console.log('========================================================');

  const clientA = new UserClient('qbao1607@gmail.com', 'Matkhau@');
  const userBEmail = `test_user_b_${Date.now()}@ielts.test`;
  const userBPass = 'PasswordB@123';

  // 1. Create User B via API / script
  const { createUser } = await import('./createUser');
  console.log(`\n[Step 1] Creating User B (${userBEmail})...`);
  await createUser({
    email: userBEmail,
    name: 'User B (Tester)',
    password: userBPass,
    currentBand: 4.5,
    targetBand: 7.0,
    studyMinutes: 120
  });

  const clientB = new UserClient(userBEmail, userBPass);

  // 2. User A logs in and performs actions
  console.log(`\n[Step 2] User A logs in (${clientA.email})...`);
  const userA = await clientA.login();
  console.log(` - Logged in as User A (ID: ${userA.id}, Name: ${userA.displayName})`);

  // User A adds custom vocabulary card
  console.log(' - User A adds custom vocabulary card "photosynthesis"...');
  await clientA.post('/api/vocab/card', {
    deckId: 'starter-academic-core',
    card: {
      id: `card-user-a-${Date.now()}`,
      word: 'photosynthesis',
      phonetic: '/ˌfoʊ.t̬oʊˈsɪn.θə.sɪs/',
      partOfSpeech: 'noun',
      definitionVi: 'quang hợp',
      definitionEn: 'the process by which green plants turn carbon dioxide and water into food using energy from sunlight',
      example: 'Photosynthesis is essential for terrestrial life.',
      collocations: ['plant photosynthesis', 'rate of photosynthesis'],
      category: 'Science',
      dueDate: new Date().toISOString(),
      state: 'learning'
    }
  });

  // User A reviews shared card v-acad-1 (marks review progress)
  console.log(' - User A reviews card v-acad-1 (SRS progress update)...');
  await clientA.post('/api/vocab/review', {
    cardId: 'v-acad-1',
    easeFactor: 2.6,
    intervalDays: 3,
    repetitions: 1,
    nextReview: new Date(Date.now() + 3 * 86400000).toISOString(),
    learningStatus: 'review'
  });

  // User A completes Grammar G02
  console.log(' - User A marks grammar G02 as mastered...');
  await clientA.post('/api/grammar', {
    topicId: 'G02',
    status: 'mastered'
  });

  // User A records a test attempt
  const attIdA = `att-user-a-${Date.now()}`;
  console.log(' - User A submits Reading Test Attempt...');
  await clientA.post('/api/attempts', {
    id: attIdA,
    skill: 'reading',
    sectionId: 'academic-mock-test-1',
    sectionTitle: 'Academic Reading Full Test 1',
    date: new Date().toISOString(),
    score: 30,
    total: 40,
    durationSeconds: 3200,
    mode: 'simulation',
    userAnswers: { '1': 'TRUE', '2': 'FALSE' },
    mistakeTags: [
      {
        questionNumber: 2,
        type: 'true-false-not-given',
        userAnswer: 'TRUE',
        correctAnswer: 'FALSE',
        distractorNote: 'User overlooked qualifying word',
        errorType: 'distractor'
      }
    ]
  });

  // User A completes daily protocol task
  console.log(' - User A updates daily study protocol...');
  const today = new Date().toISOString().split('T')[0];
  await clientA.post('/api/protocol', {
    date: today,
    dayNumber: 15,
    tasks: [{ id: 'task-reading', completed: true }],
    streakDays: 4
  });

  const syncChangeId = `sync-isolation-${Date.now()}`;
  await clientA.post('/api/sync/push', { changes: [{
    id: syncChangeId,
    changeId: syncChangeId,
    userId: 'spoofed-user-id',
    entity: 'grammar',
    recordId: 'sync-isolation-check',
    operation: 'upsert',
    payload: 'mastered',
    updatedAt: Date.now()
  }] });
  const syncA = await clientA.get('/api/sync/pull?cursor=0');
  if (!(syncA.changes || []).some((change: any) => change.recordId === 'sync-isolation-check' && change.payload === 'mastered')) {
    throw new Error('SYNC FAILURE: User A cannot pull their accepted batch change.');
  }

  console.log(' - User A logging out...');
  await clientA.logout();

  // 3. User B logs in and asserts complete isolation
  console.log(`\n[Step 3] User B logs in (${clientB.email})...`);
  const userB = await clientB.login();
  console.log(` - Logged in as User B (ID: ${userB.id}, Name: ${userB.displayName})`);

  const syncB = await clientB.get('/api/sync/pull?cursor=0');
  if ((syncB.changes || []).some((change: any) => change.recordId === 'sync-isolation-check')) {
    throw new Error('ISOLATION FAILURE: User B can pull User A sync changes.');
  }
  console.log(' ✓ ISOLATION PASS: Sync pull is partitioned by the authenticated user.');

  // Check 1: User B must NOT see User A's custom card "photosynthesis"
  const decksB = await clientB.get('/api/decks');
  const allCardsB = (decksB.decks || []).flatMap((d: any) => d.cards || []);
  const hasUserACard = allCardsB.some((c: any) => c.word.toLowerCase() === 'photosynthesis');
  if (hasUserACard) {
    throw new Error('ISOLATION FAILURE: User B can see User A custom card "photosynthesis"!');
  }
  console.log(' ✓ ISOLATION PASS: User B cannot see User A custom card "photosynthesis".');

  // Check 2: User B's SRS state for v-acad-1 must be initial (reps = 0, state = 'new'), NOT User A's review
  const cardV1B = allCardsB.find((c: any) => c.id === 'v-acad-1');
  if (cardV1B && (cardV1B.repetition > 0 || cardV1B.state === 'review')) {
    throw new Error(`ISOLATION FAILURE: User B has User A SRS progress for v-acad-1! (${cardV1B.state})`);
  }
  console.log(` ✓ ISOLATION PASS: User B SRS state for shared card v-acad-1 is independent (reps: ${cardV1B?.repetition}, state: ${cardV1B?.state}).`);

  // Check 3: User B grammar progress must NOT contain G02
  const grammarB = await clientB.get('/api/grammar');
  if (grammarB.progress && grammarB.progress['G02'] === 'mastered') {
    throw new Error('ISOLATION FAILURE: User B sees User A grammar progress for G02!');
  }
  console.log(' ✓ ISOLATION PASS: User B grammar progress does not contain User A G02 mastered status.');

  // Check 4: User B must have 0 test attempts
  const attemptsB = await clientB.get('/api/attempts');
  if (attemptsB.attempts && attemptsB.attempts.length > 0) {
    throw new Error(`ISOLATION FAILURE: User B sees ${attemptsB.attempts.length} attempts from User A!`);
  }
  console.log(' ✓ ISOLATION PASS: User B has exactly 0 test attempts.');

  // Check 5: User B must have 0 recorded mistakes
  const mistakesB = await clientB.get('/api/mistakes');
  if (mistakesB.mistakes && mistakesB.mistakes.length > 0) {
    throw new Error(`ISOLATION FAILURE: User B sees ${mistakesB.mistakes.length} mistakes from User A!`);
  }
  console.log(' ✓ ISOLATION PASS: User B has exactly 0 recorded mistakes.');

  // Check 6: User B daily protocol must be empty/unstarted
  const protocolB = await clientB.get(`/api/protocol?date=${today}`);
  if (protocolB.record && protocolB.record.dayNumber === 15) {
    throw new Error('ISOLATION FAILURE: User B sees User A daily protocol!');
  }
  console.log(' ✓ ISOLATION PASS: User B daily protocol is completely independent.');

  // 4. User B creates their own data
  console.log('\n[Step 4] User B creates their own data...');
  await clientB.post('/api/grammar', {
    topicId: 'G03',
    status: 'studying'
  });
  await clientB.post('/api/vocab/card', {
    deckId: 'starter-academic-core',
    card: {
      id: `card-user-b-${Date.now()}`,
      word: 'biodegradable',
      definitionVi: 'có thể phân hủy sinh học',
      example: 'Biodegradable packaging reduces landfill volume.',
      dueDate: new Date().toISOString(),
      state: 'new'
    }
  });

  console.log(' - User B logging out...');
  await clientB.logout();

  // 5. User A logs back in and verifies their original data remains 100% intact
  console.log(`\n[Step 5] User A logs back in (${clientA.email})...`);
  await clientA.login();

  const decksA = await clientA.get('/api/decks');
  const allCardsA = (decksA.decks || []).flatMap((d: any) => d.cards || []);

  const hasPhotosynthesis = allCardsA.some((c: any) => c.word.toLowerCase() === 'photosynthesis');
  const hasBiodegradable = allCardsA.some((c: any) => c.word.toLowerCase() === 'biodegradable');
  const cardV1A = allCardsA.find((c: any) => c.id === 'v-acad-1');

  if (!hasPhotosynthesis) {
    throw new Error('DATA LOSS: User A custom card "photosynthesis" disappeared!');
  }
  if (hasBiodegradable) {
    throw new Error('ISOLATION FAILURE: User A can see User B custom card "biodegradable"!');
  }
  if (cardV1A?.state !== 'review' || cardV1A?.repetition !== 1) {
    throw new Error(`DATA LOSS: User A SRS state was altered! (${cardV1A?.state})`);
  }
  console.log(' ✓ INTEGRITY PASS: User A custom card "photosynthesis" is intact, and User B "biodegradable" is invisible.');
  console.log(` ✓ INTEGRITY PASS: User A SRS state for v-acad-1 is intact (reps: ${cardV1A?.repetition}, state: ${cardV1A?.state}).`);

  const grammarA = await clientA.get('/api/grammar');
  if (grammarA.progress?.['G02'] !== 'mastered') {
    throw new Error('DATA LOSS: User A grammar progress for G02 was lost!');
  }
  if (grammarA.progress?.['G03']) {
    throw new Error('ISOLATION FAILURE: User A sees User B grammar progress for G03!');
  }
  console.log(' ✓ INTEGRITY PASS: User A grammar progress (G02 mastered) is intact and isolated from User B.');

  const attemptsA = await clientA.get('/api/attempts');
  const foundAttemptA = (attemptsA.attempts || []).some((a: any) => a.id === attIdA);
  if (!foundAttemptA) {
    throw new Error(`DATA LOSS: User A test attempt ${attIdA} was not found!`);
  }
  console.log(' ✓ INTEGRITY PASS: User A test attempt is preserved.');

  console.log('\n========================================================');
  console.log(' ALL TWO-USER ISOLATION TESTS PASSED 100% SUCCESSFULLY! ');
  console.log('========================================================\n');
}

runTwoUserTest().catch(err => {
  console.error('\n❌ TWO-USER ISOLATION TEST FAILED:', err);
  process.exit(1);
});
