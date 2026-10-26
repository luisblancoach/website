"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { HeroContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function Hero({ content }: { content: HeroContent }) {
  const { portalOpen } = useVenture();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || portalOpen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let frame = 0;
    let x = 0;
    const paint = () => {
      frame = 0;
      root.style.setProperty("--neo-sky-x", `${(x * 10).toFixed(1)}px`);
      root.style.setProperty("--neo-land-x", `${(x * -10).toFixed(1)}px`);
      root.style.setProperty("--neo-title-x", `${(x * 8).toFixed(1)}px`);
    };
    const updatePointer = (event: PointerEvent) => {
      if (motion.matches || !finePointer.matches || document.hidden) return;
      x = event.clientX / window.innerWidth - 0.5;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => { cancelAnimationFrame(frame); x = 0; paint(); };
    root.addEventListener("pointermove", updatePointer, { passive: true });
    root.addEventListener("pointerleave", reset);
    return () => {
      root.removeEventListener("pointermove", updatePointer);
      root.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [portalOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || portalOpen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let previousDistance = -1;
    let travel = 1;
    let top = 0;
    const updateScroll = () => {
      if (frame || !visible || document.hidden || motion.matches) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (hero) {
          const distance = Math.min(Math.max(window.scrollY - top, 0), travel);
          if (distance === previousDistance) return;
          previousDistance = distance;
          const progress = distance / travel;
          const root = hero;
          root.style.setProperty("--neo-progress", progress.toFixed(3));
          root.style.setProperty("--neo-sky-y", `${(distance * 0.035).toFixed(1)}px`);
          root.style.setProperty("--neo-fore-y", `${(distance * -0.34).toFixed(1)}px`);
          root.style.setProperty("--neo-copy-y", `${(distance * -0.3).toFixed(1)}px`);
      root.style.setProperty("--neo-copy-opacity", (1 - progress * 0.72).toFixed(3));
        }
      });
    };
    const resize = () => {
      travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      top = hero.offsetTop;
      previousDistance = -1;
      updateScroll();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateScroll(); });
    const sizes = new ResizeObserver(resize);
    observer.observe(hero);
    sizes.observe(hero);
    resize();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      observer.disconnect();
      sizes.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [portalOpen]);

  return (
    <section className={styles.hero} id="top" ref={heroRef}>
      <div className={styles.heroStage}>
        <div className={styles.heroCelestial} aria-hidden="true">
          <span className={styles.moonLarge} />
          <span className={styles.moonSmall} />
          <span className={styles.orbitLine} />
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <video
            className={styles.heroImage}
            poster="/images/neo/hero-light-poster.png"
            data-scene="light"
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source media="(max-width: 900px)" src="/videos/venture/hero-light-mobile.mp4" type="video/mp4" />
            <source src="/videos/venture/hero-light-pingpong.mp4" type="video/mp4" />
          </video>
          <video
            className={`${styles.heroImage} ${styles.heroNightImage}`}
            poster="/images/neo/hero-dark-poster.png"
            data-scene="dark"
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source media="(max-width: 900px)" src="/videos/venture/hero-dark-mobile.mp4" type="video/mp4" />
            <source src="/videos/venture/hero-dark-pingpong.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.heroWash} />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /><CopyText copy={content.eyebrow} before=" " /></p>
          <div className={content.title.long ? `${styles.heroTitle} ${styles.heroTitleLong}` : styles.heroTitle}>
            <h1><span><CopyText copy={content.title.lead} /></span><br /><em><CopyText copy={content.title.em} /></em></h1>
          </div>
        </div>
        <div className={styles.heroSupplement}>
          <p className={styles.heroDek}>
            <CopyText copy={content.dek} />
          </p>
          <div className={styles.heroPaths} aria-label="Ways into RaidGuild">
            {content.paths.map((path) => (
              <NarrativeAnchor
                key={path.label.id}
                link={path}
                className={[styles.pill, path.variant === "filled" ? styles.pillFilled : styles.pillOutline, path.primary ? styles.heroPrimaryPath : ""].filter(Boolean).join(" ")}
              >
                <span><CopyText copy={path.label} /></span><i className={styles.pillIcon} aria-hidden="true">{path.icon}</i>
              </NarrativeAnchor>
            ))}
          </div>
        </div>
        <div className={styles.heroIndex}>
          <span>TRANSMISSION</span>
          <strong>001</strong>
        </div>
        <p className={styles.heroScrollCue} aria-hidden="true">&lt;&lt;&lt; SCROLL TO DESCEND</p>
        <div className={`${styles.heroForeground} ${styles.heroForegroundLeft}`} aria-hidden="true">
          <Image
            src="/images/neo/hero-foreground.png"
            alt=""
            fill
            priority
            sizes="110vw"
            className={styles.foregroundImage}
          />
        </div>
        <div className={`${styles.heroForeground} ${styles.heroForegroundRight}`} aria-hidden="true">
          <Image
            src="/images/neo/hero-foreground.png"
            alt=""
            fill
            priority
            sizes="110vw"
            className={styles.foregroundImage}
          />
        </div>
      </div>
    </section>
  );
}
