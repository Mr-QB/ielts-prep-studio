import assert from 'node:assert/strict';
import test from 'node:test';
import { GRAMMAR_TOPICS } from '../src/data/grammarData';
import { STRATEGY_SECTIONS } from '../src/data/strategyData';
import { WRITING_PHRASE_BANK, WRITING_TASK1_NOTES, WRITING_TASK2_NOTES } from '../src/data/writingData';
import { MY_STORY_BANK, SPEAKING_GENERAL_TIPS, SPEAKING_PARTS_DATA } from '../src/data/speakingData';
import { APTIS_SAMPLES } from '../src/components/AptisSamplesView';

test('every active built-in learning collection carries a truthful provenance label', () => {
  const studioAuthored = [
    ...GRAMMAR_TOPICS,
    ...STRATEGY_SECTIONS,
    ...WRITING_TASK1_NOTES,
    ...WRITING_TASK2_NOTES,
    ...WRITING_PHRASE_BANK,
    ...SPEAKING_PARTS_DATA,
    ...MY_STORY_BANK,
    SPEAKING_GENERAL_TIPS
  ];

  assert.ok(studioAuthored.length > 0);
  assert.ok(studioAuthored.every(item => item.provenance === 'ielts_prep_original'));
  assert.ok(APTIS_SAMPLES.length > 0);
  assert.ok(APTIS_SAMPLES.every(item => item.provenance === 'aptis_import_unverified'));
});
