export type AppTab = 'listening' | 'reading' | 'grammar' | 'vocab';

export type ExamMode = 'simulation' | 'study';

// --- Listening Types ---
export interface ListeningQuestion {
  id: string;
  number: number;
  type: 'fill-blank' | 'multiple-choice';
  prompt: string;
  options?: string[]; // for multiple choice
  correctAnswer: string; // trimmed lowercase match or letter
  acceptableAnswers?: string[];
  explanation: string;
  transcriptTimestamp?: number; // seconds
}

export interface ListeningSection {
  id: string;
  title: string;
  sectionNumber: 1 | 2 | 3 | 4;
  context: string;
  audioSources: {
    label: string;
    url: string;
  }[];
  duration: number; // approximate duration in seconds
  instructions: string;
  questions: ListeningQuestion[];
  transcript: string;
  narratorVoice: 'en-GB' | 'en-US' | 'en-AU';
}

// --- Reading Types ---
export interface ReadingQuestion {
  id: string;
  number: number;
  type: 'true-false-notgiven' | 'multiple-choice' | 'summary-completion' | 'matching-headings';
  prompt: string;
  options?: string[]; // for MCQ or Matching Headings
  correctAnswer: string;
  explanation: string;
  paragraphReference?: string; // e.g. "Paragraph B"
}

export interface ReadingPassage {
  id: string;
  title: string;
  subtitle?: string;
  passageNumber: 1 | 2 | 3;
  topic: string;
  content: {
    label: string; // e.g., "A", "B", "C"
    text: string;
  }[];
  questions: ReadingQuestion[];
}

// --- Grammar Types ---
export interface GrammarExercise {
  id: string;
  type: 'rewrite' | 'fill-gap' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  band6Example?: string;
  band8Example?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  subtitle: string;
  level: string; // e.g. "Band 7.0 - 8.5"
  formula: string;
  concept: string;
  bandComparison: {
    band6: string;
    band8: string;
    analysis: string;
  }[];
  rules: string[];
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
  // SRS properties
  repetition: number;
  intervalDays: number; // in days (or fractions)
  easeFactor: number; // default 2.5
  dueDate: string; // ISO string
  lastReviewed?: string;
  state: 'new' | 'learning' | 'review' | 'mastered';
}

export interface VocabDeck {
  id: string;
  name: string;
  description: string;
  cards: VocabCard[];
}
