import { notFound } from 'next/navigation';
import { getProject, getProjects, getSiteSettings } from '../../../lib/sanity';
import { Header, Footer } from '../../ui';
import { formatProjectPeriod } from '../../../lib/project-period.mjs';
import { getYouTubeEmbedUrl } from '../../../lib/youtube.mjs';
import { sanityImageSrcSet, sanityImageUrl } from '../../../lib/image-url.mjs';
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProject(slug);
  return { title: p ? `${p.title} — EWOTE` : 'Project — EWOTE' };
}
export default async function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getProject(slug), getSiteSettings()]);
  if (!p) notFound();
  const embedUrl = getYouTubeEmbedUrl(p.youtubeUrl);
  return (
    <>
      <Header />
      <main id="main">
        <div className="detail-cover">
          <img
            src={sanityImageUrl(p.images[0], 1920, 82)}
            srcSet={sanityImageSrcSet(p.images[0], [768, 1280, 1920], 82)}
            sizes="100vw"
            alt={p.title}
          />
        </div>
        <section className="detail-intro">
          <a href="/work/">← ALL WORK</a>
          <h1>{p.title}</h1>
          <div className="detail-meta">
            <p className="detail-description">{p.description}</p>
            <div className="detail-facts">
              <p>{formatProjectPeriod(p.startDate, p.endDate, p.date)}</p>
              <p>{p.tags.join(' / ')}</p>
            </div>
          </div>
        </section>
        {embedUrl && (
          <div className="youtube-embed">
            <iframe
              src={embedUrl}
              title={`${p.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
        <div className="detail-gallery">
          {p.images.slice(1).map((src, i) => (
            <img
              key={i}
              src={sanityImageUrl(src, 1600, 80)}
              srcSet={sanityImageSrcSet(src)}
              sizes="100vw"
              alt={`${p.title} 상세 이미지 ${i + 1}`}
              loading="lazy"
            />
          ))}
        </div>
        <a className="all-work" href="/work/">
          BACK TO ALL WORK ↗
        </a>
      </main>
      <Footer settings={settings} />
    </>
  );
}
