import test from 'node:test';
import assert from 'node:assert/strict';
import { getYouTubeEmbedUrl } from '../lib/youtube.mjs';

for (const url of ['https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://youtu.be/dQw4w9WgXcQ','https://www.youtube.com/shorts/dQw4w9WgXcQ']) {
  test(`normalizes ${url}`, () => assert.equal(getYouTubeEmbedUrl(url), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'));
}
test('rejects unsupported or malformed video URLs', () => {
  assert.equal(getYouTubeEmbedUrl('https://example.com/video'), undefined);
  assert.equal(getYouTubeEmbedUrl('bad'), undefined);
});
