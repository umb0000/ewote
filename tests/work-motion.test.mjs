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
