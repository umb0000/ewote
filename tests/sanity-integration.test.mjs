import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Sanity adapter targets the approved public dataset without a token', () => {
  const source = readFileSync(
    new URL('../lib/sanity.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /projectId:\s*'zb6cjjh8'/);
  assert.match(source, /dataset:\s*'production'/);
  assert.match(source, /useCdn:\s*true/);
  assert.doesNotMatch(source, /token:/);
});

test('project query resolves image URLs and retains local fallback content', () => {
  const source = readFileSync(
    new URL('../lib/sanity.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /images\[\]\.asset->url/);
  assert.match(source, /homeVideo\.asset->url/);
  assert.match(source, /workVideo\.asset->url/);
  assert.match(source, /featuredProject->/);
  assert.match(source, /youtubeUrl/);
  assert.match(source, /coalesce\(order,\s*9999\)/);
  assert.match(source, /fallbackProjects/);
  assert.match(source, /getProjects/);
  assert.match(source, /getProject/);
});

test('Studio schema exposes every portfolio field used by the site', () => {
  const source = readFileSync(
    new URL('../studio/schemaTypes/project.ts', import.meta.url),
    'utf8',
  );
  for (const field of [
    'title',
    'slug',
    'subtitle',
    'date',
    'startDate',
    'endDate',
    'tags',
    'images',
    'description',
  ]) {
    assert.match(source, new RegExp(`name:\\s*'${field}'`));
  }
});
