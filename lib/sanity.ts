import { createClient } from '@sanity/client';
import { projects as fallbackProjects, type Project } from './content';

export const sanityClient = createClient({
  projectId: 'zb6cjjh8',
  dataset: 'production',
  apiVersion: '2026-03-01',
  useCdn: true,
});

const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(date desc) {
  title,
  "slug": slug.current,
  subtitle,
  date,
  tags,
  "images": images[].asset->url,
  description
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
