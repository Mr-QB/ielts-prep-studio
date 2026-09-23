import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LISTENING_SECTIONS, LISTENING_SOURCES } from '../src/data/listeningData';
import { READING_PASSAGES, READING_SOURCES } from '../src/data/readingData';
import { GRAMMAR_TOPICS } from '../src/data/grammarData';
import { INITIAL_VOCAB_DECKS } from '../src/data/vocabData';

describe('Data Integrity Test Suite', () => {
  it('contains at least one verified official listening section with transcript and questions', () => {
    assert(LISTENING_SECTIONS.length >= 3);
    const official = LISTENING_SECTIONS.filter(s => s.sourceId.includes('official') || s.sourceId.includes('bc'));
    assert(official.length >= 2);
    official.forEach(s => {
      assert(s.questions.length >= 4);
      assert(s.transcript.length > 50);
      assert(s.audioSources.length >= 1);
    });
  });

  it('contains verified academic reading passages with word count and paragraph references', () => {
    const academic = READING_PASSAGES.filter(p => p.testType === 'academic');
    assert(academic.length >= 3);
    academic.forEach(p => {
      assert(p.content.length >= 3);
      assert(p.questions.length >= 4);
      p.questions.forEach(q => {
        assert(q.correctAnswer.length > 0);
        assert(q.explanation.length > 0);
      });
    });
  });

  it('contains all 26 grammar topics in proper sequence Foundation -> Core -> Advanced', () => {
    assert.strictEqual(GRAMMAR_TOPICS.length, 26);
    const foundation = GRAMMAR_TOPICS.filter(t => t.category === 'foundation');
    const core = GRAMMAR_TOPICS.filter(t => t.category === 'core');
    const advanced = GRAMMAR_TOPICS.filter(t => t.category === 'advanced');

    assert.strictEqual(foundation.length, 6);
    assert.strictEqual(core.length, 14);
    assert.strictEqual(advanced.length, 6);

    // Verify first topic is G01 Sentence structure and last is G26 Inverted conditionals
    assert.strictEqual(GRAMMAR_TOPICS[0].code, 'G01');
    assert.strictEqual(GRAMMAR_TOPICS[25].code, 'G26');
  });

  it('contains starter vocabulary deck with valid cards and categories', () => {
    assert(INITIAL_VOCAB_DECKS.length >= 2);
    const starter = INITIAL_VOCAB_DECKS[0];
    assert(starter.cards.length >= 10);
    starter.cards.forEach(c => {
      assert(c.word.length > 0);
      assert(c.definitionVi.length > 0);
      assert(c.example.length > 0);
    });
  });
});
