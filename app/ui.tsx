'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { defaultSiteSettings, type SiteSettings } from '../lib/site-settings.mjs';

export function Header() {
  const path = usePathname();
  return (
    <>
      <a className="skip" href="#main">
        본문 바로가기
      </a>
      <header className="header">
        <a href="/" className="wordmark" aria-label="EWOTE HOME">
          EWOTE
        </a>
        <nav aria-label="메인 메뉴">
          <a href="/#about">ABOUT</a>
          <a
            aria-current={path.startsWith('/work') ? 'page' : undefined}
            href="/work/"
          >
            WORK
          </a>
          <a href="/#contact">CONTACT</a>
        </nav>
        <span className="header-index">
          <img src="/favicon_ewote.svg" alt="EWOTE symbol" />
        </span>
      </header>
    </>
  );
}

export function Film({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src]);

  return (
    <div className="film">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        aria-label={label}
      />
      {failed && <span className="video-status">영상 준비 중</span>}
    </div>
  );
}
export function Footer({ settings = defaultSiteSettings }: { settings?: SiteSettings }) {
  return (
    <footer id="contact">
      <div>
        <span className="eyebrow">{settings.contactEyebrow}</span>
        <h2>
          {settings.contactHeadingLines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
        </h2>
        <p className="contact-placeholder">{settings.contactMessage}</p>
        {settings.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
        {settings.socialLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}
      </div>
      <div className="footer-line">
        <a href="/" className="wordmark">
          EWOTE
        </a>
        <span>© 2026 EWOTE</span>
        <a href="#main">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
