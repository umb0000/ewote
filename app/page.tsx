import { Header, Film, Footer } from './ui';
import { getProjects, getSiteSettings } from '../lib/sanity';
import { LetterPile } from './letter-pile';
export default async function Home() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const featured = settings.featuredProject || projects[0];
  return (
    <>
      <Header />
      <main id="main">
        <section className="home-hero">
          <LetterPile />
          <div className="hero-note">
            <span>INDEPENDENT CREATIVE TEAM</span>
            <span>FILM · IMAGE · DIRECTION</span>
          </div>

        </section>
        <section id="film" className="home-film">
          <Film
            src={settings.homeVideo}
            poster={settings.homePoster}
            label="EWOTE showreel"
          />
          <div className="film-caption">
          </div>
        </section>
        <section id="about" className="about">
          <span className="eyebrow">ABOUT</span>
          <p>{settings.homeIntroLines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
          <div className="about-bottom">
            <span>{settings.homeServiceLine}</span>
            <a href="/work/">EXPLORE OUR WORK ↗</a>
          </div>
        </section>
        <section className="featured">
          <a href={'/work/' + featured.slug + '/'}>
            <img
              src={featured.images[0]}
              alt={featured.title}
              loading="lazy"
            />
            <div className="featured-caption">
              <span>WORK</span>
              <h2>{featured.title} ↗</h2>
            </div>
          </a>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
