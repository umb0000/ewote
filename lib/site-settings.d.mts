import type { Project } from './content';
export type SiteSettings = {
  homeVideo: string; homePoster: string; homeIntroLines: string[]; homeServiceLine: string;
  featuredProject?: Project; workVideo: string; workPoster: string; workEyebrow: string; workTitle: string;
  contactEyebrow: string; contactHeadingLines: string[]; contactMessage: string; contactEmail: string;
  socialLinks: { label: string; url: string }[]; seoTitle: string; seoDescription: string; seoImage: string;
};
export const defaultSiteSettings: Readonly<SiteSettings>;
export function normalizeSiteSettings(value: unknown): SiteSettings;
