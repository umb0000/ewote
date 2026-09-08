'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(false);
  const paused = useRef(false);
  const inView = useRef(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (
        inView.current &&
        !document.hidden &&
        !paused.current &&
        !reduced.matches
      ) {
        video.play().catch(() => setPlaying(false));
      } else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setActive(true);
        }
        sync();
      },
      { threshold: 0.12 },
    );
    observer.observe(video);
    const onReduced = () => sync();
    reduced.addEventListener('change', onReduced);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', onReduced);
      video.pause();
    };
  }, []);
  async function toggle() {
    const video = ref.current;
    if (!video) return;
    if (!video.paused) {
      paused.current = true;
      video.pause();
    } else {
      paused.current = false;
      setActive(true);
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    }
  }
  return (
    <div className="film">
      <video
        ref={ref}
        src={active ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => {
          if (
            inView.current &&
            !paused.current &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            ref.current?.play().catch(() => setPlaying(false));
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        aria-label={label}
      />
      {failed ? (
        <span className="video-status">영상 준비 중</span>
      ) : (
        <button
          className="video-control"
          onClick={toggle}
          aria-label={playing ? '영상 일시 정지' : '영상 재생'}
        >
          {playing ? 'Ⅱ PAUSE' : '▶ PLAY'}
        </button>
      )}
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

