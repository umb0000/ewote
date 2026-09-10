import { defineField, defineType, type FileRule, type FileValue, type ValidationContext } from 'sanity';

const videoDescription = 'MP4 only. Export at 1080p or lower and keep the file between 10–30MB.';
const maxVideoSize = (rule: FileRule) => rule.custom(async (value: FileValue | undefined, context: ValidationContext) => {
  const assetId = value?.asset?._ref;
  if (!assetId) return true;
  const size = await context.getClient({ apiVersion: '2025-02-19' }).fetch(
    '*[_id == $assetId][0].size',
    { assetId },
  );
  return !size || size <= 30_000_000 || 'Video must be 30MB or smaller.';
});

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'homeVideo', title: 'HOME video', description: videoDescription, type: 'file', options: { accept: 'video/mp4' }, validation: maxVideoSize }),
    defineField({ name: 'homePoster', title: 'HOME poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'homeIntroLines', title: 'HOME introduction', type: 'array', of: [{ type: 'string' }], validation: (rule) => rule.max(2) }),
    defineField({ name: 'homeServiceLine', title: 'HOME service line', type: 'string' }),
    defineField({ name: 'featuredProject', title: 'Featured project', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'workVideo', title: 'WORK video', description: videoDescription, type: 'file', options: { accept: 'video/mp4' }, validation: maxVideoSize }),
    defineField({ name: 'workPoster', title: 'WORK poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'workEyebrow', title: 'WORK eyebrow', type: 'string' }),
    defineField({ name: 'workTitle', title: 'WORK title', type: 'string' }),
    defineField({ name: 'contactEyebrow', title: 'Contact eyebrow', type: 'string' }),
    defineField({ name: 'contactHeadingLines', title: 'Contact heading', type: 'array', of: [{ type: 'string' }], validation: (rule) => rule.max(2) }),
    defineField({ name: 'contactMessage', title: 'Contact message', type: 'text', rows: 3 }),
    defineField({ name: 'contactEmail', title: 'Contact email', type: 'email' }),
    defineField({
      name: 'socialLinks', title: 'Social links', type: 'array',
      of: [{ type: 'object', fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required() }),
      ] }],
    }),
    defineField({ name: 'seoTitle', title: 'SEO title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3 }),
    defineField({ name: 'seoImage', title: 'SEO share image', type: 'image', options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
