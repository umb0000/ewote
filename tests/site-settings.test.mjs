import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultSiteSettings, normalizeSiteSettings } from '../lib/site-settings.mjs';

test('site settings use field-level fallbacks', () => {
  const result = normalizeSiteSettings({ workTitle: 'ARCHIVE' });
  assert.equal(result.workTitle, 'ARCHIVE');
  assert.equal(result.seoTitle, defaultSiteSettings.seoTitle);
  assert.equal(result.homeVideo, defaultSiteSettings.homeVideo);
});

test('missing media stays empty instead of showing demo assets', () => {
  const result = normalizeSiteSettings(undefined);
  assert.equal(result.homeVideo, '');
  assert.equal(result.homePoster, '');
  assert.equal(result.workVideo, '');
  assert.equal(result.workPoster, '');
  assert.doesNotMatch(JSON.stringify(defaultSiteSettings), /res\.cloudinary\.com\/demo/);
});

test('site settings keep valid arrays and reject incomplete social links', () => {
  const result = normalizeSiteSettings({
    homeIntroLines: ['LINE ONE', 'LINE TWO'],
    socialLinks: [{ label: 'Instagram', url: 'https://instagram.com/ewote' }, { label: '', url: 'bad' }],
  });
  assert.deepEqual(result.homeIntroLines, ['LINE ONE', 'LINE TWO']);
  assert.deepEqual(result.socialLinks, [{ label: 'Instagram', url: 'https://instagram.com/ewote' }]);
});
