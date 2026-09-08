'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const path = usePathname();
  return (
    <>
      <a className="skip" href="#main">
        본문 바로가기
      </a>
      <header className="header">
        <Link href="/" className="wordmark" aria-label="EWOTE HOME">
          EWOTE
        </Link>
        <nav aria-label="메인 메뉴">
          <Link href="/#about">ABOUT</Link>
          <Link
            aria-current={path.startsWith('/work') ? 'page' : undefined}
            href="/work/"
          >
            WORK
          </Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>
        <span className="header-index">
          CREATIVE
          <br />
          COLLECTIVE
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
  return (
    <div className="film">
      <video
        src={src}
        poster={poster}
        autoPlay
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
export function Footer() {
  return (
    <footer id="contact">
      <div>
        <span className="eyebrow">( CONTACT )</span>
        <h2>
          LET’S MAKE
          <br />
          SOMETHING MOVE.
        </h2>
        <p className="contact-placeholder">연락처는 준비 중입니다.</p>
      </div>
      <div className="footer-line">
        <Link href="/" className="wordmark">
          EWOTE
        </Link>
        <span>© 2026 EWOTE</span>
        <a href="#main">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
