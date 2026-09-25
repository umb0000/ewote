import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

test('site uses a light neutral color system', () => {
  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*light;/s);
  assert.match(css, /:root\s*\{[^}]*--bg:\s*#f5f5f2;/s);
  assert.match(css, /:root\s*\{[^}]*--fg:\s*#080808;/s);
  assert.match(css, /:root\s*\{[^}]*--muted:\s*#666663;/s);
  assert.match(css, /:root\s*\{[^}]*--line:\s*#d4d4d0;/s);
});

test('hero and work controls use the inverted light palette', () => {
  assert.match(css, /\.home-hero\s*\{[^}]*background:\s*var\(--bg\);/s);
  assert.match(css, /\.work-hero:after\s*\{[^}]*#f5f5f2/s);
  assert.match(css, /\.filters button,[\s\S]*?\.project-tags button\s*\{[^}]*background:\s*#dededb;[^}]*color:\s*#222;/s);
  assert.match(css, /\.filters button\[aria-pressed='true'\]\s*\{[^}]*background:\s*#080808;[^}]*color:\s*#f5f5f2;/s);
});
test('featured project caption adapts its contrast over imagery', () => {
  assert.match(css, /\.featured-caption\s*\{[^}]*color:\s*white;[^}]*mix-blend-mode:\s*difference;/s);
});