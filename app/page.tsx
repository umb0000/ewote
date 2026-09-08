import Link from 'next/link';
import { Header, Film, Footer } from './ui';
import { media } from '../lib/content';
import { getProjects } from '../lib/sanity';
import { LetterPile } from './letter-pile';
export default async function Home() {
  const projects = await getProjects();
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
          <a className="scroll-note" href="#film">
            SCROLL TO EXPLORE ↓
          </a>
        </section>
        <section id="film" className="home-film">
          <Film
            src={media.homeVideo}
            poster={media.poster}
            label="EWOTE showreel"
          />
          <div className="film-caption">
            <span>EWOTE / SHOWREEL</span>
            <span>PLAY ON REPEAT ↗</span>
          </div>
        </section>
        <section id="about" className="about">
          <span className="eyebrow">( ABOUT EWOTE )</span>
          <p>
            아이디어를 이미지로.
            <br />
            순간을 움직임으로.
          </p>
          <div className="about-bottom">
            <span>FILM, IMAGE & CREATIVE DIRECTION</span>
            <Link href="/work/">EXPLORE OUR WORK ↗</Link>
          </div>
        </section>
        <section className="featured">
          <Link href={'/work/' + projects[0].slug + '/'}>
            <img
              src={projects[0].images[0]}
              alt={projects[0].title}
              loading="lazy"
            />
            <div className="featured-caption">
              <span>SELECTED WORK / 01</span>
              <h2>{projects[0].title} ↗</h2>
            </div>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
