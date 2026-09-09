import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('project detail separates description and facts and renders optional video', () => {
  const page = readFileSync(new URL('../app/work/[slug]/page.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(page, /className="detail-description"/);
  assert.match(page, /className="detail-facts"/);
  assert.match(page, /className="youtube-embed"/);
  assert.match(page, /embedUrl\s*&&/);
  assert.doesNotMatch(page, /DEMO PROJECT/);
  assert.match(css, /\.detail-description[^{]*\{[^}]*grid-column:\s*1/);
  assert.match(css, /\.detail-facts[^{]*\{[^}]*grid-column:\s*2[^}]*grid-row:\s*2/);
  assert.match(css, /\.youtube-embed[^{]*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
});
