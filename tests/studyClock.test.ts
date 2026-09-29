import test from 'node:test';
import assert from 'node:assert/strict';
import { ActiveStudyClock } from '../src/utils/studyClock';

test('active study time excludes time spent with the study page hidden', () => {
  const clock = new ActiveStudyClock(1_000);
  assert.equal(clock.elapsedSeconds(6_000), 5);
  clock.setVisible(false, 6_000);
  assert.equal(clock.elapsedSeconds(16_000), 5);
  clock.setVisible(true, 16_000);
  assert.equal(clock.elapsedSeconds(21_500), 10);
});

test('active study clock handles repeated visibility changes and clamps negative time', () => {
  const clock = new ActiveStudyClock(10_000);
  clock.setVisible(false, 12_000);
  clock.setVisible(false, 13_000);
  clock.setVisible(true, 18_000);
  clock.setVisible(true, 19_000);
  assert.equal(clock.elapsedSeconds(23_000), 7);
  assert.equal(clock.elapsedSeconds(9_000), 0);
});
