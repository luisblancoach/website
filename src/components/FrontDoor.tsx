"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FrontDoor.module.css";
import { ProgressBar } from "./ui/progress";

const bootMessages = [
  "Cold-starting the walker",
  "Booting OuroborOS",
  "Plugging into the WORM",
  "Tuning the guild frequency",
  "Charting the uncharted",
];

export default function FrontDoor({ onEnter, isNight }: { onEnter: (destination: string) => void; isNight: boolean }) {
  const [opening, setOpening] = useState(false);
  const [loading, setLoading] = useState({ percent: 0, finished: false, fallback: false });
  const [bootProgress, setBootProgress] = useState(0);
  const bootFinished = bootProgress === 100;
  const bootMessage = Math.min(bootMessages.length - 1, Math.floor(bootProgress / 20));

  useEffect(() => {
    // Deliberately paced atmosphere, independent of the real background loading.
    // Entry is never gated by either this sequence or asset readiness.
    const started = performance.now();
    const interval = setInterval(() => {
      const progress = Math.min(100, Math.floor((performance.now() - started) / 80));
      setBootProgress(progress);
      if (progress === 100) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let disposed = false;
    let completed = 0;
    let failed = false;
    const cleanups: (() => void)[] = [];
    const video = document.querySelector<HTMLVideoElement>(`video[data-scene="${isNight ? "dark" : "light"}"]`);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const useVideo = !!video && !connection?.saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sources = [...new Set([
      `/images/neo/hero-${isNight ? "dark" : "light"}-poster.png`,
      ...Array.from(document.querySelectorAll<HTMLImageElement>("#top img")).map(img => img.currentSrc || img.src),
    ])];
    const total = sources.length + 1 + Number(useVideo);
    setLoading({ percent: 0, finished: false, fallback: false });
    const track = (subscribe: (finish: (ok: boolean) => void) => void) => {
      let settled = false;
      const timeout = setTimeout(() => finish(false), 12000);
      const finish = (ok: boolean) => {
        if (settled || disposed) return;
        settled = true;
        clearTimeout(timeout);
        failed ||= !ok;
        completed += 1;
        setLoading({ percent: Math.round(completed / total * 100), finished: completed === total, fallback: failed });
      };
      cleanups.push(() => clearTimeout(timeout));
      subscribe(finish);
    };
    sources.forEach(src => track(finish => {
      const image = new Image();
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = src;
      cleanups.push(() => { image.onload = null; image.onerror = null; });
    }));
    track(finish => { void document.fonts.ready.then(() => finish(true), () => finish(false)); });
    if (useVideo && video) track(finish => {
      const check = () => {
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.readyState >= 3 && video.buffered.start(i) <= .1 && video.buffered.end(i) >= Math.min(2, video.duration)) finish(true);
        }
      };
      const error = () => finish(false);
      video.preload = "auto";
      video.addEventListener("progress", check);
      video.addEventListener("canplay", check);
      video.addEventListener("error", error);
      check();
      cleanups.push(() => {
        video.removeEventListener("progress", check);
        video.removeEventListener("canplay", check);
        video.removeEventListener("error", error);
      });
    });
    return () => { disposed = true; cleanups.forEach(cleanup => cleanup()); };
  }, [isNight]);
  const leaving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enter = useCallback((destination: string) => {
    if (leaving.current) return;
    leaving.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (destination !== "top" || reduced) {
      onEnter(destination);
      return;
    }
    setOpening(true);
    timer.current = setTimeout(() => onEnter(destination), 1450);
  }, [onEnter]);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.location.hash && window.location.hash !== "#top") {
      onEnter(window.location.hash.slice(1));
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        enter("top");
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", key);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enter, onEnter]);

  return (
    <section className={`${styles.door} ${opening ? styles.opening : ""}`} aria-label="Welcome to RaidGuild">
      <div className={styles.canopy} aria-hidden="true">
        {[styles.upperLeft, styles.upperRight, styles.middleLeft, styles.middleRight, styles.lowerLeft, styles.lowerRight].map((cluster) => (
          <div className={`${styles.cluster} ${cluster}`} key={cluster}>
            <div className={`${styles.leaves} ${styles.left}`} />
            <div className={`${styles.leaves} ${styles.right}`} />
          </div>
        ))}
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.brand}>
          {/* Existing identity artwork; the foliage is also reused from the hero. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/neo/raidguild-swords.png" alt="" width="48" height="48" />
          <span>RAIDGUILD</span>
        </div>
        <h1>A community for<br />curious minds.</h1>
        <p>A builder-owned network of creative and technical people who like solving hard problems.</p>
        <p className={styles.homeNote}>Go far together. Explore the people, ideas, and shared ambition behind RaidGuild.</p>
        <nav className={styles.offerings} aria-label="Work with the network">
          <h2>Work with the network</h2>
          <a href="https://raidguild.ai/" target="_blank" rel="noreferrer">
            <span><strong>Applied AI</strong><small>Explore the AI practice · raidguild.ai</small></span><span aria-hidden="true">↗</span>
          </a>
          <a href="https://raidguild-onchain-production.up.railway.app/" target="_blank" rel="noreferrer">
            <span><strong>Onchain systems</strong><small>Bring us a protocol, product, or web3 challenge</small></span><span aria-hidden="true">↗</span>
          </a>
          <a href="#project-inquiry" onClick={(event) => { event.preventDefault(); enter("project-inquiry"); }}>
            <span><strong>Talent &amp; placement</strong><small>Find creative and technical people for your team</small></span><span aria-hidden="true">↓</span>
          </a>
          <a href="#project-inquiry" onClick={(event) => { event.preventDefault(); enter("project-inquiry"); }}>
            <span><strong>Talk to someone</strong><small>Not sure where to start? Send us a note.</small></span><span aria-hidden="true">↓</span>
          </a>
        </nav>
        <div className={styles.trust}>
          <p>Built with and contributed to</p>
          <ul aria-label="Selected organizations the network has worked with">
            {[
              { name: "Gitcoin", file: "logo-Gitcoin.svg" },
              { name: "Gnosis", file: "logo-Gnosis.svg" },
              { name: "Pocket Network", file: "logo-Pocket.svg" },
              { name: "Unlock Protocol", file: "logo-Unlock.svg" },
            ].map((logo) => (
              <li key={logo.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${logo.file}`} alt={logo.name} width="100" height="28" />
              </li>
            ))}
          </ul>
        </div>
        <a className={styles.explore} href="#top" onClick={(event) => { event.preventDefault(); enter("top"); }}>
          Venture Beyond <span aria-hidden="true">↓</span>
          <small>Meet the network. Explore our world.</small>
        </a>
        <div className={styles.readiness}>
          <div><span>{bootFinished ? (loading.finished && !loading.fallback ? "Systems awake. Venture beyond." : "Signal faint. Venture onward.") : `${bootMessages[bootMessage]}…`}</span><span aria-hidden="true">{bootFinished ? "↓" : `${bootProgress}%`}</span></div>
          <ProgressBar className={styles.loadBar} value={bootProgress} aria-label="Atmospheric boot sequence" aria-valuetext={bootFinished ? "Boot sequence complete. Enter anytime." : `${bootProgress}% of boot sequence. You can enter now.`} />
          <small>Enter anytime</small>
        </div>
        <a className={styles.join} href="#guild" onClick={(event) => { event.preventDefault(); enter("guild"); }}>Join the Guild <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
