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
test('work strips reveal a centered EWOTE mark over a dark overlay', () => {
  const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(styles, /\.project-strip\s*\{[^}]*position:\s*relative;[^}]*isolation:\s*isolate;/s);
  assert.match(styles, /\.project-strip::before\s*\{[^}]*background:\s*rgb\(8 8 8 \/ 62%\);[^}]*opacity:\s*0;/s);
  assert.match(styles, /\.project-strip::after\s*\{[^}]*background:[^;]*url\('\/favicon_ewote\.svg'\)[^;]*;[^}]*opacity:\s*0;/s);
  assert.match(styles, /\.project-strip:hover::before,[\s\S]*?\.project-strip:focus-visible::before,[\s\S]*?\.project-strip:active::before\s*\{[^}]*opacity:\s*1;/s);
  assert.match(styles, /\.project-strip:hover::after,[\s\S]*?\.project-strip:focus-visible::after,[\s\S]*?\.project-strip:active::after\s*\{[^}]*opacity:\s*1;/s);
});
test('mobile project tags use one consistent grid size', () => {
  const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.project-tags\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.project-tags button\s*\{[^}]*width:\s*100%;[^}]*min-height:\s*44px;/s);
});
