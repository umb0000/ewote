import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app/ui.tsx', import.meta.url), 'utf8');

test('films autoplay silently and loop without playback controls', () => {
  assert.match(source, /\bautoPlay\b/);
  assert.match(source, /\bmuted\b/);
  assert.match(source, /\bloop\b/);
  assert.doesNotMatch(source, /className="video-control"/);
});
