import type { ListeningQuestionType, ReadingQuestionType } from '../types';

export interface PrivateBookManifest {
  id: string;
  version: number;
  schemaVersion: 1;
  bookId: string;
  title: string;
  edition: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  private: true;
  source?: { archiveItem?: string; sourcePdfSha256?: string; printedAnswerPage?: number };
  importReview?: { status: 'pending' | 'in_progress' | 'complete'; reviewedPrintedPages: number[]; outstandingIssues: number; unsupportedLayouts: string[] };
  audioStatus: 'AUDIO_IMPORT_READY' | 'available' | 'unavailable';
  tests: number[];
  importedSections: { testNumber: number; skill: 'reading' | 'listening' | 'writing'; sectionNumber: number; questionCount?: number }[];
}

export interface BookReadingQuestion {
  id: string;
  number: number;
  type: ReadingQuestionType;
  prompt: string;
  options?: string[];
  sourcePdfPage: number;
  printedPage: number;
  needsManualReview?: boolean;
}

export interface BookReadingPassage {
  id: string;
  title: string;
  text: string;
  sourcePdfPage: number;
  printedPage: number;
  questionRange: [number, number];
  needsManualReview?: boolean;
}

export interface PrivateReadingQuestionGroup {
  id: string;
  type: ReadingQuestionType;
  instructions: string;
  questionStart: number;
  questionEnd: number;
  options?: string[];
  sourcePdfPage: number;
  printedPage: number;
  questions: BookReadingQuestion[];
}

export interface PrivateReadingSection {
  schemaVersion: 1;
  bookId: string;
  testNumber: number;
  sectionNumber: number;
  title: string;
  questionGroups: PrivateReadingQuestionGroup[];
  passages: BookReadingPassage[];
}

export interface PrivateReadingTest {
  id: string;
  sourcePackId: string;
  testNumber: number;
  sections: PrivateReadingSection[];
}

export interface PrivateListeningQuestion {
  id: string;
  number: number;
  type: ListeningQuestionType;
  prompt: string;
  options?: string[];
  sourcePdfPage: number;
  printedPage: number;
  needsManualReview?: boolean;
}

export interface PrivateListeningQuestionGroup {
  id: string;
  type: ListeningQuestionType;
  instructions: string;
  questionStart: number;
  questionEnd: number;
  options?: string[];
  asset?: string;
  sourcePdfPage: number;
  printedPage: number;
  questions: PrivateListeningQuestion[];
}

export interface PrivateListeningPart {
  partNumber: 1 | 2 | 3 | 4;
  title: string;
  sourcePdfPage: number;
  printedPage: number;
  audio: { status: 'unavailable' | 'available'; fileName?: string };
  transcript?: string;
  questionGroups: PrivateListeningQuestionGroup[];
}

export interface PrivateListeningTest {
  schemaVersion: 1;
  bookId: string;
  id: string;
  sourcePackId: string;
  testNumber: number;
  parts: PrivateListeningPart[];
}

export interface PrivateListeningTranscripts {
  schemaVersion: 1;
  bookId: string;
  testNumber: number;
  parts: { partNumber: 1 | 2 | 3 | 4; sourcePdfPages: number[]; printedPages: number[]; transcript: string; needsManualReview?: boolean }[];
}

export interface PrivateWritingTask {
  taskNumber: 1 | 2;
  prompt: string;
  sourcePdfPage: number;
  printedPage: number;
  needsManualReview?: boolean;
  sampleAnswer?: string;
  sampleAnswerBand?: number;
  sampleAnswerAsset?: string;
  sampleAnswerSourcePdfPage?: number;
  sampleAnswerPrintedPage?: number;
}

export interface PrivateWritingSection {
  schemaVersion: 1;
  bookId: string;
  testNumber: number;
  tasks: PrivateWritingTask[];
}

export interface PrivateWritingTest {
  id: string;
  sourcePackId: string;
  testNumber: number;
  tasks: PrivateWritingTask[];
}

export type BookAnswerValue = string | string[];
export interface BookAnswerConstraint {
  questionNumbers: number[];
  acceptableAssignments: string[][];
}

export interface BookAnswerKey {
  schemaVersion: 1;
  testNumber: number;
  module: 'reading' | 'listening';
  sourcePdfPage: number;
  printedPage: number;
  answers: Record<string, BookAnswerValue>;
  constraints?: BookAnswerConstraint[];
}
