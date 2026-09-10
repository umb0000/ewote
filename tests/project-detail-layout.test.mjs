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

test('YouTube embeds have half their height as vertical margin', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(css, /\.youtube-embed\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9;/s);
  assert.match(css, /\.youtube-embed\s*\{[^}]*margin-block:\s*28\.125vw;/s);
  assert.match(css, /\.detail-gallery\s*\{[^}]*gap:\s*0;/s);
});
test('project detail heading uses the reduced responsive size', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(css, /\.detail-intro h1\s*\{[^}]*font-size:\s*clamp\(40px,\s*6\.5vw,\s*105px\);/s);
});
