export function normalizeProjectTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => tag === 'PHOTO' ? 'PHOTOGRAPHY' : tag);
}