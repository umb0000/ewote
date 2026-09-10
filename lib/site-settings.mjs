export const defaultSiteSettings = Object.freeze({
  homeVideo: '',
  homePoster: '',
  homeIntroLines: ['𝖤𝖳𝖤𝖱𝖭𝖠𝖫 𝖶𝖨𝖲𝖣𝖮𝖬 𝖮𝖭 𝖳𝖧𝖤 𝖤𝖠𝖱𝖳𝖧'],
  homeServiceLine: 'FILM, IMAGE & CREATIVE DIRECTION',
  featuredProject: undefined,
  workVideo: '',
  workPoster: '',
  workEyebrow: '',
  workTitle: 'WORK',
  contactEyebrow: '( CONTACT )',
  contactHeadingLines: ['LET’S MAKE', 'SOMETHING MOVE.'],
  contactMessage: '연락처는 준비 중입니다.',
  contactEmail: '',
  socialLinks: [],
  seoTitle: 'EWOTE — Creative team',
  seoDescription: 'EWOTE. Film, image and creative direction.',
  seoImage: '',
});

const text = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;
const lines = (value, fallback) => {
  if (!Array.isArray(value)) return fallback;
  const clean = value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim()).slice(0, 2);
  return clean.length ? clean : fallback;
};

export function normalizeSiteSettings(value) {
  const source = value && typeof value === 'object' ? value : {};
  const socialLinks = Array.isArray(source.socialLinks)
    ? source.socialLinks.filter((link) => link && typeof link.label === 'string' && link.label.trim() && typeof link.url === 'string' && /^https?:\/\//.test(link.url))
      .map(({ label, url }) => ({ label: label.trim(), url }))
    : defaultSiteSettings.socialLinks;
  return {
    homeVideo: text(source.homeVideo, defaultSiteSettings.homeVideo),
    homePoster: text(source.homePoster, defaultSiteSettings.homePoster),
    homeIntroLines: lines(source.homeIntroLines, defaultSiteSettings.homeIntroLines),
    homeServiceLine: text(source.homeServiceLine, defaultSiteSettings.homeServiceLine),
    featuredProject: source.featuredProject || defaultSiteSettings.featuredProject,
    workVideo: text(source.workVideo, defaultSiteSettings.workVideo),
    workPoster: text(source.workPoster, defaultSiteSettings.workPoster),
    workEyebrow: typeof source.workEyebrow === 'string' ? source.workEyebrow.trim() : defaultSiteSettings.workEyebrow,
    workTitle: text(source.workTitle, defaultSiteSettings.workTitle),
    contactEyebrow: text(source.contactEyebrow, defaultSiteSettings.contactEyebrow),
    contactHeadingLines: lines(source.contactHeadingLines, defaultSiteSettings.contactHeadingLines),
    contactMessage: text(source.contactMessage, defaultSiteSettings.contactMessage),
    contactEmail: typeof source.contactEmail === 'string' ? source.contactEmail.trim() : defaultSiteSettings.contactEmail,
    socialLinks,
    seoTitle: text(source.seoTitle, defaultSiteSettings.seoTitle),
    seoDescription: text(source.seoDescription, defaultSiteSettings.seoDescription),
    seoImage: typeof source.seoImage === 'string' ? source.seoImage : defaultSiteSettings.seoImage,
  };
}
