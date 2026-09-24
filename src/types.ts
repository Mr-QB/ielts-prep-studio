export type TopTab = 'today' | 'practice' | 'knowledge' | 'review';
export type PracticeSubTab = 'reading' | 'listening';
export type KnowledgeSubTab = 'grammar' | 'vocab' | 'writing' | 'speaking' | 'strategy';
export type ReviewSubTab = 'mistakes' | 'progress';

export type AppTab =
  | 'today'
  | 'reading'
  | 'listening'
  | 'grammar'
  | 'vocab'
  | 'writing'
  | 'speaking'
  | 'strategy'
  | 'mistakes'
  | 'progress'
  | 'weak-areas';

export type ReadingQuestionGroup = 'statements' | 'matching' | 'completion' | 'questions';

export type MistakeRetryStatus = 'new' | 'retry' | 'learning' | 'mastered';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  currentBand: number;
  targetBand: number;
  dailyStudyMinutes: number;
  roadmapStartDate?: string;
}

export type ExamMode = 'simulation' | 'study';

export type VerificationStatus =
  | 'verified'
  | 'external-only'
  | 'needs-review'
  | 'audio-unavailable';

export type SourceProvider =
  | 'Official IELTS'
  | 'British Council'
  | 'Cambridge Local Reference'
  | 'IELTS-style Practice'
  | 'IDP IELTS';

export type SourceType = 'official' | 'partner' | 'user-reference' | 'practice';

export type TestType = 'academic' | 'general-training';

export type SkillType = 'listening' | 'reading' | 'grammar' | 'vocab' | 'writing' | 'speaking';

export type CreatedFrom = 'official' | 'imported' | 'generated';

export type CopyrightStatus =
  | 'public-domain'
  | 'creative-commons'
  | 'fair-use-educational'
  | 'user-imported-private'
  | 'original-content';

export interface LearningSource {
  id: string;
  provider: SourceProvider;
  title: string;
  sourceType: SourceType;
  testType: TestType;
  canonicalSourceUrl?: string;
  isOfficial: boolean;
  isUserProvided: boolean;
  verifiedAt?: string;
  status: VerificationStatus;
  description?: string;
}

// ==========================================
// 1. LISTENING TYPES
// ==========================================
export type ListeningQuestionType =
  | 'form-completion'
  | 'note-completion'
  | 'table-completion'
  | 'flowchart-completion'
  | 'sentence-completion'
  | 'short-answer'
  | 'multiple-choice'
  | 'matching'
  | 'map-labelling';

export type MistakeTagType =
  | 'missed-keyword'
  | 'spelling'
  | 'plural-singular'
  | 'number'
  | 'distractor'
  | 'synonym-paraphrase'
  | 'lost-concentration'
  | 'unknown-vocabulary';

export interface AudioSourceItem {
  label: string;
  url: string;
  isSynthetic?: boolean;
  isStreamable?: boolean;
}

export interface ListeningQuestion {
  id: string;
  number: number;
  type: ListeningQuestionType;
  prompt: string;
  options?: string[]; // for multiple choice or matching
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  explanationVi?: string;
  transcriptTimestamp?: number; // seconds into recording
  answerSentence?: string; // sentence in transcript containing the answer
  distractor?: string; // the misleading info, e.g. "Tuesday"
  distractorNote?: string; // why IELTS tricks listeners here
  paraphraseNote?: string; // synonym / paraphrase explanation
  targetVocab?: {
    word: string;
    definitionVi: string;
    contextSentence: string;
  }[];
}

export interface ListeningSection {
  id: string;
  sourceId: string;
  title: string;
  part: 1 | 2 | 3 | 4;
  sectionNumber: 1 | 2 | 3 | 4;
  context: string;
  instructions: string;
  duration: number; // approximate seconds
  audioSources: AudioSourceItem[];
  narratorVoice: 'en-GB' | 'en-US' | 'en-AU' | string;
  transcript: string;
  questions: ListeningQuestion[];
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedBand?: string;
  createdFrom?: CreatedFrom;
  copyrightStatus?: string;
  verificationStatus: VerificationStatus;
  canonicalUrl?: string;
  sourceNotice?: string;
}

export interface ListeningMicroDrill {
  id: string;
  skillType: string;
  title: string;
  context: string;
  audioText: string;
  audioUrl?: string;
  audioSourceLabel?: 'Real Recording' | 'TTS Practice';
  prompt: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  trapExplanation?: string;
}

export interface ListeningFullTest {
  id: string;
  title: string;
  testNumber: number;
  sourceId: string;
  sections: ListeningSection[]; // 4 sections x 10 questions = 40
  totalQuestions: number; // 40
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedBand: string;
  createdFrom: CreatedFrom;
  copyrightStatus: string;
  description: string;
  microDrills?: ListeningMicroDrill[];
}

// ==========================================
// 2. READING TYPES
// ==========================================
export type ReadingQuestionType =
  | 'true-false-notgiven'
  | 'yes-no-notgiven'
  | 'matching-headings'
  | 'matching-information'
  | 'matching-features'
  | 'matching-sentence-endings'
  | 'multiple-choice'
  | 'sentence-completion'
  | 'summary-completion'
  | 'note-completion'
  | 'table-completion'
  | 'flowchart-completion'
  | 'diagram-label-completion'
  | 'short-answer';

export interface ReadingQuestion {
  id: string;
  number: number;
  type: ReadingQuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  explanationVi?: string;
  paragraphReference?: string;
  evidenceSnippet?: string; // exact sentence in passage
  questionKeywords?: string; // e.g. "started"
  passageParaphrase?: string; // e.g. "was launched"
  targetVocab?: {
    word: string;
    definitionVi: string;
    contextSentence: string;
  }[];
}

export interface ReadingPassage {
  id: string;
  sourceId: string;
  title: string;
  subtitle?: string;
  passageNumber: 1 | 2 | 3;
  topic: string;
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedBand: string;
  testType: TestType;
  createdFrom: CreatedFrom;
  copyrightStatus: string;
  content: {
    label: string;
    text: string;
  }[];
  questions: ReadingQuestion[];
  questionTypes: ReadingQuestionType[];
  verificationStatus: VerificationStatus;
  canonicalUrl?: string;
  sourceNotice?: string;
}

export interface ReadingFullTest {
  id: string;
  title: string;
  testNumber: number;
  sourceId: string;
  passages: [ReadingPassage, ReadingPassage, ReadingPassage]; // 3 passages = 40 questions
  timeLimitMinutes: number; // 60
  totalQuestions: number; // 40
  createdFrom: CreatedFrom;
  copyrightStatus: string;
  description: string;
}

export interface ReadingPracticeSet {
  id: string;
  title: string;
  questionType: ReadingQuestionType;
  passageTitle: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedBand: string;
  content: {
    label: string;
    text: string;
  }[];
  questions: ReadingQuestion[];
  createdFrom: CreatedFrom;
  copyrightStatus: string;
}

export interface ReadingFoundationSet {
  id: string;
  title: string;
  targetBand: '3.5-4.5';
  targetSkill: string;
  wordCount: number;
  topic: string;
  passage: { label?: string; text: string }[];
  questions: ReadingQuestion[];
  sourceNotice?: string;
}

// ==========================================
// 3. GRAMMAR TYPES
// ==========================================
export type GrammarCategory = 'foundation' | 'core' | 'advanced';
export type GrammarTier = 'essential' | 'advanced';

export type GrammarSubjectCategory =
  | 'Sentence Basics'
  | 'Nouns & Determiners'
  | 'Description'
  | 'Clauses'
  | 'Complex Sentences'
  | 'Logic & Connections'
  | 'Academic Writing'
  | 'Advanced — Optional Band 7+';

export type GrammarSkillTag = 'Essential' | 'Writing T1' | 'Writing T2' | 'Speaking' | 'Optional 7+';

export type GrammarProgressStatus = 'not-started' | 'studying' | 'mastered';

export interface GrammarExercise {
  id: string;
  type: 'rewrite' | 'fill-gap' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  ieltsContext?: string;
}

export interface GrammarStandardLesson {
  whatToRemember: string[];
  whenToUse: string[];
  form: string;
  easyExamples: { sentence: string; note: string }[];
  ieltsExamples: { sentence: string; context: string }[];
  commonMistakes: { incorrect: string; corrected: string; why: string }[];
  miniPractice?: GrammarExercise[];
  quickReview: { rule: string; explanation: string }[];
}

export interface GrammarTopic {
  id: string;
  code: string; // e.g. "G01", "G08", "G24"
  category: GrammarCategory;
  tier?: GrammarTier; // essential (Band 4.0-6.5) vs advanced (Optional for Band 7+)
  subjectCategory?: GrammarSubjectCategory;
  tags?: GrammarSkillTag[];
  title: string;
  whyItMatters: string;
  formula: string;
  concept: string;
  rules: string[];
  examples: {
    sentence: string;
    note: string;
  }[];
  commonMistake: {
    incorrect: string;
    corrected: string;
    explanation: string;
  };
  ieltsApplication: string;
  exercises: GrammarExercise[];
  standardLesson?: GrammarStandardLesson;
}

// ==========================================
// 4. VOCABULARY & SRS TYPES
// ==========================================
export type SRSIntervalRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export type VocabBandLevel = 'core-4.0-5.5' | 'core-5.5-6.5' | 'optional-7+';

export type VocabTopicTheme =
  | 'Education'
  | 'Environment'
  | 'Technology'
  | 'Work'
  | 'Health'
  | 'Transport'
  | 'Cities'
  | 'Crime'
  | 'Media'
  | 'Society'
  | 'Science'
  | 'Culture'
  | 'Travel';

export type VocabReviewMode =
  | 'recall' // Mode A: Reveal meaning and self-rate
  | 'typing_vi_en' // Mode B: VN -> EN typing in sentence
  | 'cloze' // Mode C: EN Cloze from reading/listening context
  | 'audio_spelling' // Mode D: Audio / IPA -> type English spelling
  | 'collocation' // Mode E: Discrimination / Natural collocation MCQ
  | 'paraphrase_context'; // Mode F: Best synonym in sentence context

export type VocabErrorType =
  | 'NONE'
  | 'SPELLING_ERROR'
  | 'MORPHOLOGY_ERROR'
  | 'RECALL_FAILURE'
  | 'COLLOCATION_ERROR'
  | 'MEANING_CONFUSION';

export interface VocabReviewLog {
  id: string;
  userId: string;
  cardId: string;
  reviewMode: VocabReviewMode;
  promptType?: string;
  correct: boolean;
  rating?: SRSIntervalRating;
  responseTimeMs: number;
  hintUsed?: boolean;
  typedAnswer?: string;
  errorType: VocabErrorType;
  createdAt: number;
}

export interface VocabLookupSense {
  definitionEn: string;
  partOfSpeech?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  viSuggestion?: string;
  relevanceScore?: number;
}

export interface VocabLookupResult {
  word: string;
  lemma: string;
  phonetic: string;
  audio?: string;
  audioSource?: 'dictionary' | 'tts';
  partOfSpeech: string;
  senses: VocabLookupSense[];
  collocations?: string[];
}

export interface VocabCard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definitionVi: string;
  definitionEn: string;
  example: string;
  exampleVi?: string;
  collocations?: string[];
  paraphrases?: string[];
  category: string;
  topicTheme?: VocabTopicTheme;
  bandLevel?: VocabBandLevel;
  source?: string;
  sourceType?: 'reading' | 'listening' | 'manual' | 'starter';
  sourceId?: string;
  sourceContext?: string;
  lemma?: string;
  audio?: string;
  audioSource?: 'dictionary' | 'tts';
  wordFamily?: { word: string; pos: string }[];
  acceptedAnswers?: string[];
  priority?: number; // Higher for personal reading/listening saved words
  // FSRS optional metadata
  difficulty?: number; // 0.0 - 1.0 (FSRS D)
  stability?: number; // Days (FSRS S)
  retrievability?: number; // 0.0 - 1.0 (FSRS R)
  masteryState?: 'new' | 'learning' | 'recalling' | 'stable' | 'weak_again';
  // SRS state
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  dueDate: string;
  lastReviewed?: string;
  state: 'new' | 'learning' | 'review' | 'mastered';
}

export interface VocabDeck {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  source: string;
  cards: VocabCard[];
}

export interface ParsePreviewResult {
  parsed: VocabCard[];
  previewCards: VocabCard[];
  invalidLinesCount: number;
  duplicateCount: number;
  existingDuplicateWords: string[];
}

// ==========================================
// 5. WRITING & SPEAKING NOTES TYPES (Notes Only)
// ==========================================
export type WritingTask1Type =
  | 'line-graph'
  | 'bar-chart'
  | 'pie-chart'
  | 'table'
  | 'mixed-chart'
  | 'process'
  | 'map';

export type WritingTask2Type =
  | 'opinion'
  | 'discussion'
  | 'advantages-disadvantages'
  | 'problem-solution'
  | 'two-part-question';

export interface WritingTask1Note {
  id: string;
  type: WritingTask1Type;
  title: string;
  subtitle: string;
  structure: {
    section: 'Introduction' | 'Overview' | 'Body 1' | 'Body 2';
    purpose: string;
    formula: string;
    sentenceFrames: string[];
  }[];
  usefulPhrases: {
    category: string;
    items: string[];
  }[];
  commonMistakes: {
    mistake: string;
    whyWrong: string;
    fix: string;
  }[];
  checklist: string[];
}

export interface WritingTask2Note {
  id: string;
  type: WritingTask2Type;
  title: string;
  subtitle: string;
  promptExample: string;
  structure: {
    section: 'Introduction' | 'Body 1' | 'Body 2' | 'Conclusion';
    purpose: string;
    formula: string;
    sentenceFrames: string[];
  }[];
  usefulPhrases: {
    category: string;
    items: string[];
  }[];
  commonMistakes: {
    mistake: string;
    whyWrong: string;
    fix: string;
  }[];
  checklist: string[];
}

export interface SpeakingNotePart {
  part: 1 | 2 | 3;
  title: string;
  frameworkName: string;
  formula: string;
  explanation: string;
  exampleDemonstration: {
    question: string;
    steps: { label: string; text: string }[];
  };
  usefulFrames: string[];
  commonTopics: {
    topic: string;
    sampleQuestions: string[];
  }[];
}

export interface SpeakingGeneralTips {
  fillers: { phrase: string; context: string }[];
  elongationTechniques: { strategy: string; prompt: string; example: string }[];
  handlingUnknownWords: { strategy: string; template: string }[];
  selfCorrection: { strategy: string; template: string }[];
  chatGptPrompts: { label: string; prompt: string; description: string }[];
  fluencyTips?: string[];
  lexicalTips?: string[];
  grammarTips?: string[];
  pronunciationTips?: string[];
}

// ==========================================
// 6. ATTEMPT, MISTAKE & ANALYTICS TYPES
// ==========================================
export interface RecordedMistake {
  id: string;
  skill: 'reading' | 'listening';
  testId: string;
  testTitle: string;
  questionId: string;
  questionNumber: number;
  questionType: string;
  errorType?: MistakeTagType;
  userAnswer: string;
  correctAnswer: string;
  note?: string;
  evidence?: string;
  timestamp: string;
  status?: MistakeRetryStatus;
  retryCount?: number;
  consecutiveCorrect?: number;
  nextRetryDate?: string;
  selectedReason?: string;
  questionPrompt?: string;
  options?: string[];
}

export interface ReadingStrategyLesson {
  type: ReadingQuestionType;
  group: ReadingQuestionGroup;
  title: string;
  subtitle: string;
  officialFormat?: string;
  recommendedStrategy?: string[];
  rememberIn30Sec: string[];
  steps: string[];
  keywordsParaphrase: { question: string; passage: string; note: string }[];
  commonTraps: { trap: string; example: string; fix: string }[];
  examples: { question: string; passage: string; answer: string; reason: string }[];
  miniPractice: {
    id: string;
    passage: string;
    questions: {
      id: string;
      prompt: string;
      options?: string[];
      correctAnswer: string;
      acceptableAnswers?: string[];
      explanation: string;
    }[];
  };
  reviewTips: string[];
}

export interface ListeningStrategyLesson {
  id: string;
  title: string;
  subtitle: string;
  signalWords?: string[];
  explanation: string;
  audioExample?: {
    audioText: string;
    questionPrompt: string;
    wrongAnswer: string;
    correctAnswer: string;
    whyWrong: string;
    signalUsed: string;
  };
  practiceDrills: {
    id: string;
    audioSnippet: string;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    acceptableAnswers?: string[];
    explanation: string;
    audioType?: 'real' | 'tts';
  }[];
}

export interface ParaphraseItem {
  id: string;
  word: string;
  meaningVi: string;
  category: 'trend' | 'importance' | 'cause-effect' | 'opinion' | 'comparison' | 'problem-solution' | 'general';
  topic?: string;
  synonyms: {
    word: string;
    nuance?: string;
    example?: string;
    register?: string;
    collocation?: string;
    usageNote?: string;
  }[];
  discriminationExercise?: {
    sentence: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface SpeakingStoryItem {
  id: string;
  title: string;
  category: 'person' | 'place' | 'project' | 'challenge' | 'achievement' | 'good-news' | 'object' | 'trip' | 'skill' | 'event' | 'decision' | 'activity';
  tagline: string;
  applicableCueCards: string[];
  shortVersion: string;
  extendedVersion: string;
  usefulVocab: { phrase: string; meaningVi: string }[];
  feelingsVocab: string[];
}

export interface WritingPhraseGroup {
  id: string;
  category: string;
  descriptionVi: string;
  corePhrases: string[];
  upgradePhrases: string[];
  exampleSentence: string;
}

export interface WeakAreaStat {
  questionType: string;
  skill: 'reading' | 'listening';
  totalQuestions: number;
  incorrectCount: number;
  accuracyRate: number; // percentage (0 - 100)
  recommendation: string;
}

export interface TestAttempt {
  id: string;
  skill: 'listening' | 'reading';
  sectionId: string;
  sectionTitle: string;
  date: string;
  score: number;
  total: number;
  durationSeconds: number;
  mode: ExamMode;
  userAnswers: Record<string, string>;
  incorrectQuestionNumbers: number[];
  mistakeTags: {
    questionNumber: number;
    type: string;
    userAnswer: string;
    correctAnswer: string;
    distractorNote?: string;
    paraphraseNote?: string;
    errorType?: MistakeTagType;
  }[];
  passageScores?: {
    passageIndex: number;
    score: number;
    total: number;
    timeSpentSeconds?: number;
  }[];
  questionTypeStats?: Record<string, { correct: number; total: number }>;
}

// ==========================================
// 7. DAILY PROTOCOL & ROADMAP TYPES
// ==========================================
export interface DailyTaskItem {
  id: string;
  title: string;
  durationMin: number;
  completed: boolean;
  tabTarget: AppTab;
  subtitle: string;
}

export interface DailyProtocolRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 180
  tasks: DailyTaskItem[];
  streakDays: number;
  notes?: string;
}

export interface RoadmapPhase {
  phaseNumber: 1 | 2 | 3;
  name: string;
  weeks: string; // e.g. "Weeks 1–8"
  tagline: string;
  targetFocus: string[];
  dailyProtocolGuide: string;
}
