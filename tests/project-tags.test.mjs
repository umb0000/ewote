import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeProjectTags } from '../lib/project-tags.mjs';

test('legacy PHOTO tags are exposed as PHOTOGRAPHY', () => {
  assert.deepEqual(normalizeProjectTags(['VIDEO', 'PHOTO']), ['VIDEO', 'PHOTOGRAPHY']);
});

test('canonical tag lists and Studio options use PHOTOGRAPHY', () => {
  const content = readFileSync(new URL('../lib/content.ts', import.meta.url), 'utf8');
  const schema = readFileSync(new URL('../studio/schemaTypes/project.ts', import.meta.url), 'utf8');
  assert.match(content, /'PHOTOGRAPHY'/);
  assert.match(schema, /'PHOTOGRAPHY'/);
});