import { createClient } from '@sanity/client';
import { projects as fallbackProjects, type Project } from './content';
import { normalizeSiteSettings, type SiteSettings } from './site-settings.mjs';

export const sanityClient = createClient({
  projectId: 'zb6cjjh8',
  dataset: 'production',
  apiVersion: '2026-03-01',
  useCdn: true,
});

const projectFields = `title, "slug": slug.current, subtitle, date, startDate, endDate, order, youtubeUrl, tags, "images": images[].asset->url, description`;

const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(coalesce(order, 9999) asc, coalesce(startDate, date) desc) {
  ${projectFields}
}`;

const settingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
  "homeVideo": homeVideo.asset->url, "homePoster": homePoster.asset->url,
  homeIntroLines, homeServiceLine,
  "featuredProject": featuredProject->{${projectFields}},
  "workVideo": workVideo.asset->url, "workPoster": workPoster.asset->url,
  workEyebrow, workTitle, contactEyebrow, contactHeadingLines, contactMessage,
  contactEmail, socialLinks[]{label, url}, seoTitle, seoDescription,
  "seoImage": seoImage.asset->url
}`;

function validProjects(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every(
      (project) =>
        project &&
        typeof project.slug === 'string' &&
        typeof project.title === 'string' &&
        Array.isArray(project.images),
    )
  );
}

export async function getProjects(): Promise<Project[]> {
  try {
    const result = await sanityClient.fetch<Project[]>(projectsQuery);
    return validProjects(result) && result.length ? result : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return normalizeSiteSettings(await sanityClient.fetch(settingsQuery));
  } catch {
    return normalizeSiteSettings(undefined);
  }
}
