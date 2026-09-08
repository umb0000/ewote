export function filterProjects(projects, tag) {
  return tag === 'ALL'
    ? projects
    : projects.filter((project) => project.tags.includes(tag));
}
