import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('pages consume normalized Sanity site settings', () => {
  const home = read('../app/page.tsx');
  const work = read('../app/work/page.tsx');
  const ui = read('../app/ui.tsx');
  const layout = read('../app/layout.tsx');
  assert.match(home, /getSiteSettings\(\)/);
  assert.match(home, /settings\.homeVideo/);
  assert.match(home, /settings\.featuredProject/);
  assert.match(work, /settings\.workVideo/);
  assert.match(work, /settings\.workTitle/);
  assert.match(ui, /contactHeadingLines/);
  assert.match(ui, /socialLinks/);
  assert.match(ui, /className="contact-links"/);
  assert.match(ui, /className="contact-link"/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /settings\.seoTitle/);
});
