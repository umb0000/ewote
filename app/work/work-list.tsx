'use client';
import { useState } from 'react';
import { tags, type Project } from '../../lib/content';
import { filterProjects } from '../../lib/filter.mjs';
import { formatProjectPeriod } from '../../lib/project-period.mjs';
import { sanityImageSrcSet, sanityImageUrl } from '../../lib/image-url.mjs';
export default function WorkList({ projects }: { projects: Project[] }) {
  const [tag, setTag] = useState('ALL');
  const selected = filterProjects(projects, tag);
  return (
    <section className="work-list">
      <div className="filter-bar">
        <fieldset className="filters" aria-label="프로젝트 태그">
          {tags.map((t) => (
            <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </fieldset>
      </div>
      {selected.length === 0 ? (
        <p>해당 태그의 프로젝트가 없습니다.</p>
      ) : (
        selected.map((p, i) => (
          <article className="project-row" key={p.slug}>
            <div className="project-heading">
              <a href={'/work/' + p.slug + '/'}>
                <span className="project-number">0{i + 1}</span>
                <h2>{p.title}</h2>
                <span className="project-subtitle">{p.subtitle}</span>
              </a>
              <span>{formatProjectPeriod(p.startDate, p.endDate, p.date)} ↗</span>
            </div>
            <a
              className="project-strip"
              href={'/work/' + p.slug + '/'}
              aria-label={p.title + ' 프로젝트 보기'}
            >
              <div className="track">
                {[0, 1].map((copy) => (
                  <div
                    className="track-group"
                    key={copy}
                    aria-hidden={copy === 1 ? true : undefined}
                  >
                    {p.images.map((src, j) => (
                      <img
                        key={j}
                        src={sanityImageUrl(src, 960, 78)}
                        srcSet={sanityImageSrcSet(src, [480, 960], 78)}
                        sizes="(max-width: 700px) 70vw, 40vw"
                        alt={copy === 0 ? `${p.title} 이미지 ${j + 1}` : ''}
                        loading="lazy"
                        width="640"
                        height="400"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </a>
            <div className="project-tags">
              {p.tags.map((t) => (
                <button key={t} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
            </div>
          </article>
        ))
      )}
    </section>
  );
}
