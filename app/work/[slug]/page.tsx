import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '../../../lib/sanity';
import { Header, Footer } from '../../ui';
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
  const p = await getProject(slug);
  if (!p) notFound();
  return (
    <>
      <Header />
      <main id="main">
        <div className="detail-cover">
          <img src={p.images[0]} alt={p.title} />
        </div>
        <section className="detail-intro">
          <Link href="/work/">← ALL WORK</Link>
          <h1>{p.title}</h1>
          <div className="detail-meta">
            <p>{p.description}</p>
            <div>
              <p>{p.date}</p>
              <p>{p.tags.join(' / ')}</p>
              <p>DEMO PROJECT</p>
            </div>
          </div>
        </section>
        <div className="detail-gallery">
          {p.images.slice(1).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${p.title} 상세 이미지 ${i + 1}`}
              loading="lazy"
            />
          ))}
        </div>
        <Link className="all-work" href="/work/">
          BACK TO ALL WORK ↗
        </Link>
      </main>
      <Footer />
    </>
  );
}
