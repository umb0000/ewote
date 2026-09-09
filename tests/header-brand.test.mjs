import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('header shows the EWOTE favicon artwork in the right slot', () => {
  const source = readFileSync(
    new URL('../app/ui.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /src="\/favicon_ewote\.svg"/);
  assert.match(source, /alt="EWOTE symbol"/);
  assert.doesNotMatch(source, /CREATIVE\s*[\s\S]*COLLECTIVE/);
});
