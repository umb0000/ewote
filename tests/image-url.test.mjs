import test from 'node:test';
import assert from 'node:assert/strict';
import { sanityImageUrl, sanityImageSrcSet } from '../lib/image-url.mjs';

const source = 'https://cdn.sanity.io/images/zb6cjjh8/production/example-2400x1600.jpg';

test('optimizes Sanity image URLs for browser format and delivery size', () => {
  assert.equal(
    sanityImageUrl(source, 1600, 80),
    `${source}?auto=format&fit=max&w=1600&q=80`,
  );
});

test('keeps non-Sanity URLs unchanged', () => {
  const external = 'https://images.unsplash.com/photo.jpg?auto=format';
  assert.equal(sanityImageUrl(external, 960, 78), external);
});

test('creates responsive candidates from Sanity images only', () => {
  assert.equal(
    sanityImageSrcSet(source, [480, 960]),
    `${source}?auto=format&fit=max&w=480&q=80 480w, ${source}?auto=format&fit=max&w=960&q=80 960w`,
  );
  assert.equal(sanityImageSrcSet('https://example.com/image.jpg'), undefined);
});
