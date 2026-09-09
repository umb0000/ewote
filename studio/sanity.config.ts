import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { singletonTypes, structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'EWOTE Portfolio',
  projectId: 'zb6cjjh8',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (previous) =>
      previous.filter((item) => !singletonTypes.has(item.templateId)),
    actions: (previous, context) =>
      singletonTypes.has(context.schemaType)
        ? previous.filter(({ action }) => action !== 'delete' && action !== 'duplicate')
        : previous,
  },
});
