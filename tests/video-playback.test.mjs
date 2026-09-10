import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app/ui.tsx', import.meta.url), 'utf8');
const schema = readFileSync(new URL('../studio/schemaTypes/siteSettings.ts', import.meta.url), 'utf8');

test('films autoplay silently and loop without playback controls', () => {
  assert.match(source, /\bmuted\b/);
  assert.match(source, /\bloop\b/);
  assert.doesNotMatch(source, /className="video-control"/);
});

test('films only play while visible and pause outside the viewport', () => {
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /video\.play\(\)/);
  assert.match(source, /video\.pause\(\)/);
  assert.match(source, /threshold:\s*0\.25/);
});

test('Sanity video fields accept MP4 and explain the delivery target', () => {
  assert.match(schema, /accept:\s*'video\/mp4'/);
  assert.match(schema, /1080p/);
  assert.match(schema, /10–30MB/);
});
