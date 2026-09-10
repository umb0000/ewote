import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app/ui.tsx', import.meta.url), 'utf8');
const schema = readFileSync(new URL('../studio/schemaTypes/siteSettings.ts', import.meta.url), 'utf8');
const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

test('films autoplay silently and loop without playback controls', () => {
  assert.match(source, /\bmuted\b/);
  assert.match(source, /\bloop\b/);
  assert.match(source, /disablePictureInPicture/);
  assert.match(source, /disableRemotePlayback/);
  assert.match(source, /controlsList="nodownload noremoteplayback nopictureinpicture"/);
  assert.doesNotMatch(source, /className="video-control"/);
});

test('films render a black empty frame when no Sanity video is configured', () => {
  assert.match(source, /\{src\s*&&\s*\(/);
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

test('mobile film uses a stable aspect-ratio box while scrolling', () => {
  assert.match(css, /\.home-film \.film\s*\{[^}]*height:\s*auto;/s);
  assert.match(css, /\.film video\s*\{[^}]*position:\s*absolute;/s);
  assert.match(css, /\.film video\s*\{[^}]*inset:\s*0;/s);
  assert.match(source, /videoWidth/);
  assert.match(source, /videoHeight/);
  assert.doesNotMatch(css, /\.home-film\s*\{[^}]*margin-top:/s);
  assert.doesNotMatch(css, /\.home-film \.film\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5;/s);
});
