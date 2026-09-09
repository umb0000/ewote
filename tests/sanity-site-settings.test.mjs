import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Studio exposes singleton site settings and project presentation fields', () => {
  const settings = read('../studio/schemaTypes/siteSettings.ts');
  const project = read('../studio/schemaTypes/project.ts');
  const structure = read('../studio/structure.ts');
  const config = read('../studio/sanity.config.ts');

  for (const field of ['homeVideo','homePoster','homeIntroLines','homeServiceLine','featuredProject','workVideo','workPoster','workEyebrow','workTitle','contactEyebrow','contactHeadingLines','contactMessage','contactEmail','socialLinks','seoTitle','seoDescription','seoImage']) {
    assert.match(settings, new RegExp(`name:\\s*'${field}'`));
  }
  assert.match(project, /name:\s*'order'/);
  assert.match(project, /name:\s*'youtubeUrl'/);
  assert.match(structure, /documentId\('siteSettings'\)/);
  assert.match(config, /newDocumentOptions/);
  assert.match(config, /singletonTypes/);
});
