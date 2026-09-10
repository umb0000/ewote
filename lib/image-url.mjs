const sanityImageHost = 'cdn.sanity.io';

function isSanityImage(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === sanityImageHost && parsed.pathname.startsWith('/images/');
  } catch {
    return false;
  }
}

export function sanityImageUrl(source, width, quality = 80) {
  if (!isSanityImage(source)) return source;
  const url = new URL(source);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  return url.toString();
}

export function sanityImageSrcSet(source, widths = [480, 960, 1600], quality = 80) {
  if (!isSanityImage(source)) return undefined;
  return widths.map((width) => `${sanityImageUrl(source, width, quality)} ${width}w`).join(', ');
}
