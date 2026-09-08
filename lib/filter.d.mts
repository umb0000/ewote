export function filterProjects<T extends { tags: string[] }>(
  projects: T[],
  tag: string,
): T[];
