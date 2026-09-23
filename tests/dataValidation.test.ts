import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LISTENING_FULL_TESTS, LISTENING_SECTIONS } from '../src/data/listeningData';
import { READING_FULL_TESTS, READING_PASSAGES } from '../src/data/readingData';
import { READING_PRACTICE_SETS } from '../src/data/readingPracticeData';
import { GRAMMAR_TOPICS } from '../src/data/grammarData';
import { INITIAL_VOCAB_DECKS } from '../src/data/vocabData';
import { WRITING_TASK1_NOTES, WRITING_TASK2_NOTES } from '../src/data/writingData';
import { SPEAKING_PARTS_DATA } from '../src/data/speakingData';
import { calculateReadingBand, calculateListeningBand } from '../src/utils/ieltsScoring';

describe('Data Integrity & Curriculum Test Suite', () => {
  it('contains complete Academic Reading Full Test 1 with 3 passages and exactly 40 questions', () => {
    assert(READING_FULL_TESTS.length >= 1);
    const ft = READING_FULL_TESTS[0];
    assert.strictEqual(ft.passages.length, 3);

    let totalQ = 0;
    const seenNumbers = new Set<number>();

    ft.passages.forEach(p => {
      assert(p.content.length >= 3);
      totalQ += p.questions.length;
      p.questions.forEach(q => {
        assert(q.correctAnswer.length > 0);
        assert(q.explanation.length > 0);
        assert(q.explanationVi && q.explanationVi.length > 0);
        seenNumbers.add(q.number);
      });
    });

    assert.strictEqual(totalQ, 40);
    assert.strictEqual(seenNumbers.size, 40);
    for (let i = 1; i <= 40; i++) {
      assert(seenNumbers.has(i), `Missing question number ${i}`);
    }
  });

  it('contains complete Academic Listening Full Test 1 with 4 parts and exactly 40 questions', () => {
    assert(LISTENING_FULL_TESTS.length >= 1);
    const ft = LISTENING_FULL_TESTS[0];
    assert.strictEqual(ft.sections.length, 4);

    let totalQ = 0;
    const seenNumbers = new Set<number>();

    ft.sections.forEach(s => {
      assert(s.transcript.length > 100);
      assert(s.audioSources.length >= 1);
      totalQ += s.questions.length;
      s.questions.forEach(q => {
        assert(q.correctAnswer.length > 0);
        assert(q.explanation.length > 0);
        seenNumbers.add(q.number);
      });
    });

    assert.strictEqual(totalQ, 40);
    assert.strictEqual(seenNumbers.size, 40);
    for (let i = 1; i <= 40; i++) {
      assert(seenNumbers.has(i), `Missing question number ${i}`);
    }
  });

  it('contains dedicated Reading Practice sets across key IELTS question types', () => {
    assert(READING_PRACTICE_SETS.length >= 10);
    READING_PRACTICE_SETS.forEach(ps => {
      assert(ps.questions.length >= 1);
      ps.questions.forEach(q => {
        assert(q.prompt.length > 0);
        assert(q.correctAnswer.length > 0);
        assert(q.evidenceSnippet || q.explanationVi);
      });
    });
  });

  it('verifies 26 grammar topics split properly into Essential (G01–G20) and Advanced (G21–G26)', () => {
    assert.strictEqual(GRAMMAR_TOPICS.length, 26);
    assert.strictEqual(GRAMMAR_TOPICS[0].code, 'G01');
    assert.strictEqual(GRAMMAR_TOPICS[25].code, 'G26');

    // First 20 topics are Foundation (G01-G06) and Core (G07-G20)
    for (let i = 0; i < 20; i++) {
      assert(GRAMMAR_TOPICS[i].category === 'foundation' || GRAMMAR_TOPICS[i].category === 'core');
    }
    // Last 6 topics are Advanced (G21-G26)
    for (let i = 20; i < 26; i++) {
      assert.strictEqual(GRAMMAR_TOPICS[i].category, 'advanced');
    }
  });

  it('verifies Writing Task 1 & Task 2 notes frameworks and checklists', () => {
    assert.strictEqual(WRITING_TASK1_NOTES.length, 7);
    assert.strictEqual(WRITING_TASK2_NOTES.length, 5);

    WRITING_TASK1_NOTES.forEach(t1 => {
      assert.strictEqual(t1.structure.length, 4);
      assert(t1.checklist.length >= 2);
    });

    WRITING_TASK2_NOTES.forEach(t2 => {
      assert.strictEqual(t2.structure.length, 4);
      assert(t2.checklist.length >= 2);
    });
  });

  it('verifies Speaking notes frameworks for Parts 1, 2, 3', () => {
    assert.strictEqual(SPEAKING_PARTS_DATA.length, 3);
    SPEAKING_PARTS_DATA.forEach(p => {
      assert(p.frameworkName.length > 0);
      assert(p.usefulFrames.length >= 3);
      assert(p.commonTopics.length >= 2);
    });
  });

  it('verifies IELTS score conversion logic for Academic Reading and Listening', () => {
    // Reading Academic
    assert.strictEqual(calculateReadingBand(40, 'academic'), 9.0);
    assert.strictEqual(calculateReadingBand(30, 'academic'), 7.0);
    assert.strictEqual(calculateReadingBand(27, 'academic'), 6.5);
    assert.strictEqual(calculateReadingBand(23, 'academic'), 6.0);
    assert.strictEqual(calculateReadingBand(15, 'academic'), 5.0);
    assert.strictEqual(calculateReadingBand(10, 'academic'), 4.0);

    // Listening
    assert.strictEqual(calculateListeningBand(40), 9.0);
    assert.strictEqual(calculateListeningBand(30), 7.0);
    assert.strictEqual(calculateListeningBand(26), 6.5);
    assert.strictEqual(calculateListeningBand(23), 6.0);
    assert.strictEqual(calculateListeningBand(16), 5.0);
  });
});
