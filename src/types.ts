export type AppTab = 'today' | 'listening' | 'reading' | 'grammar' | 'vocab';

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
  | 'IELTS-style Practice';

export type SourceType = 'official' | 'partner' | 'user-reference' | 'practice';

export type TestType = 'academic' | 'general-training';

export type SkillType = 'listening' | 'reading' | 'grammar' | 'vocab';

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

// --- Listening Types ---
export type ListeningQuestionType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'note-completion'
  | 'table-completion'
  | 'form-completion'
  | 'flowchart-completion'
  | 'map-labelling'
  | 'short-answer';

export interface ListeningQuestion {
  id: string;
  number: number;
  type: ListeningQuestionType;
  prompt: string;
  options?: string[]; // for multiple choice or matching
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  transcriptTimestamp?: number; // seconds into recording
  distractorNote?: string;
}

export interface AudioSourceItem {
  label: string;
  url: string;
  isSynthetic?: boolean;
  isStreamable?: boolean;
}

export interface ListeningSection {
  id: string;
  sourceId: string;
  title: string;
  sectionNumber: 1 | 2 | 3 | 4;
  context: string;
  instructions: string;
  duration: number; // approximate duration in seconds
  audioSources: AudioSourceItem[];
  narratorVoice: 'en-GB' | 'en-US' | 'en-AU' | string;
  transcript: string;
  questions: ListeningQuestion[];
  verificationStatus: VerificationStatus;
  canonicalUrl?: string;
  sourceNotice?: string;
}

// --- Reading Types ---
export type ReadingQuestionType =
  | 'multiple-choice'
  | 'true-false-notgiven'
  | 'yes-no-notgiven'
  | 'matching-headings'
  | 'matching-features'
  | 'matching-sentence-endings'
  | 'summary-completion'
  | 'sentence-completion'
  | 'note-completion'
  | 'table-completion'
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
  paragraphReference?: string;
}

export interface ReadingPassage {
  id: string;
  sourceId: string;
  title: string;
  subtitle?: string;
  passageNumber: 1 | 2 | 3;
  topic: string;
  wordCount: number;
  testType: TestType;
  content: {
    label: string;
    text: string;
  }[];
  questions: ReadingQuestion[];
  verificationStatus: VerificationStatus;
  canonicalUrl?: string;
  sourceNotice?: string;
}

// --- Grammar Types ---
export type GrammarCategory = 'foundation' | 'core' | 'advanced';

export type GrammarProgressStatus = 'not-started' | 'learning' | 'completed' | 'needs-review';

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

export interface GrammarTopic {
  id: string;
  code: string; // e.g. "G01", "G08", "G24"
  category: GrammarCategory;
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
}

// --- Vocabulary & SRS Types ---
export type SRSIntervalRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

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
  category: string;
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

// --- Attempt & History Types ---
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
  }[];
}
