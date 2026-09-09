import { defineField, defineType } from 'sanity';

const tagOptions = [
  'VIDEO',
  'BRANDING',
  'ART DIRECTION',
  'PHOTO',
  'GRAPHIC DESIGN',
].map((tag) => ({ title: tag, value: tag }));

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      description: 'The site displays the year and month only.',
      type: 'date',
      validation: (rule) =>
        rule.custom((value, context) =>
          value || context.document?.date
            ? true
            : 'Start date is required.',
        ),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      description: 'Leave empty for a single month or an ongoing project.',
      type: 'date',
      validation: (rule) =>
        rule.custom((value, context) => {
          const start = context.document?.startDate;
          return !value || !start || value >= start
            ? true
            : 'End date must be after the start date.';
        }),
    }),
    defineField({
      name: 'date',
      title: 'Legacy date',
      description: 'Kept temporarily for existing content.',
      type: 'date',
      hidden: ({ value }) => !value,
      readOnly: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: tagOptions, layout: 'grid' },
    }),
    defineField({
      name: 'images',
      title: 'Images (first image is the cover)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'images.0' },
  },
});
