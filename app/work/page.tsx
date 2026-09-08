import { Header, Film, Footer } from '../ui';
import { media } from '../../lib/content';
import { getProjects } from '../../lib/sanity';
import WorkList from './work-list';
export const metadata = { title: 'WORK — EWOTE' };
export default async function Work() {
  const projects = await getProjects();
  return (
    <>
      <Header />
      <main id="main">
        <section className="work-hero">
          <Film
            src={media.workVideo}
            poster={media.poster}
            label="EWOTE WORK showreel"
          />
          <div className="work-title">
            <span className="eyebrow">( SELECTED PROJECTS )</span>
            <h1>WORK</h1>
          </div>
        </section>
        <WorkList projects={projects} />
      </main>
      <Footer />
    </>
  );
}
