const idPattern = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeEmbedUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    let id;
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0];
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      id = url.pathname.startsWith('/shorts/')
        ? url.pathname.split('/')[2]
        : url.searchParams.get('v') || undefined;
    }
    return idPattern.test(id || '')
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : undefined;
  } catch {
    return undefined;
  }
}
