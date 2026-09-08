import test from 'node:test';
import assert from 'node:assert/strict';
import { letterMotion } from '../lib/letter-motion.mjs';

test('letters fall one at a time in reading order', () => {
  assert.equal(letterMotion.length, 5);
  for (let i = 1; i < letterMotion.length; i += 1) {
    assert.ok(letterMotion[i].delay > letterMotion[i - 1].delay);
  }
});

test('every letter rolls before settling', () => {
  for (const motion of letterMotion) {
    assert.ok(Math.abs(motion.rollX) >= 18);
    assert.ok(Math.abs(motion.startRotate - motion.restRotate) >= 90);
  }
});
