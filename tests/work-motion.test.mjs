import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('all work image tracks run continuously in one direction', () => {
  const component = readFileSync(
    new URL('../app/work/work-list.tsx', import.meta.url),
    'utf8',
  );
  const styles = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(component, /motion-toggle|setPaused|\breverse\b/);
  assert.doesNotMatch(styles, /\.reverse\s*\{|\.paused \.track/);
  assert.doesNotMatch(styles, /\.project-strip:hover \.track/);
});

test('work filter controls use a zero-saturation palette', () => {
  const styles = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.match(styles, /\.filters button\s*\{[^}]*background:\s*transparent;[^}]*color:\s*var\(--fg\);/s);
  assert.match(styles, /\.filters button:hover,[\s\S]*?\.filters button:focus-visible\s*\{[^}]*background:\s*#dededb;/s);
  assert.match(styles, /\.filters button\[aria-pressed='true'\]\s*\{[^}]*background:\s*#080808;[^}]*color:\s*#f5f5f2;/s);
  assert.match(styles, /\.project-tags button\s*\{[^}]*background:\s*#dededb;[^}]*color:\s*#222;/s);
});
