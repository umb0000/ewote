import { Header, Film, Footer } from '../ui';
import { getProjects, getSiteSettings } from '../../lib/sanity';
import WorkList from './work-list';
export const metadata = { title: 'WORK — EWOTE' };
export default async function Work() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  return (
    <>
      <Header />
      <main id="main">
        <section className="work-hero">
          <Film
            src={settings.workVideo}
            poster={settings.workPoster}
            label="EWOTE WORK showreel"
          />
          <div className="work-title">
            {settings.workEyebrow && <span className="eyebrow">{settings.workEyebrow}</span>}
            <h1>{settings.workTitle}</h1>
          </div>
        </section>
        <WorkList projects={projects} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
