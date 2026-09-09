import { defineField, defineType } from 'sanity';

const twoLines = (rule: any) => rule.max(2);

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'homeVideo', title: 'HOME video', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'homePoster', title: 'HOME poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'homeIntroLines', title: 'HOME introduction', type: 'array', of: [{ type: 'string' }], validation: twoLines }),
    defineField({ name: 'homeServiceLine', title: 'HOME service line', type: 'string' }),
    defineField({ name: 'featuredProject', title: 'Featured project', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'workVideo', title: 'WORK video', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'workPoster', title: 'WORK poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'workEyebrow', title: 'WORK eyebrow', type: 'string' }),
    defineField({ name: 'workTitle', title: 'WORK title', type: 'string' }),
    defineField({ name: 'contactEyebrow', title: 'Contact eyebrow', type: 'string' }),
    defineField({ name: 'contactHeadingLines', title: 'Contact heading', type: 'array', of: [{ type: 'string' }], validation: twoLines }),
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
