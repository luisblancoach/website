"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { HeroContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// `grouped` is the October 23 composition used by the audience routes: the dek
// and actions sit under the title in one column. "/" keeps them separate.
// `curtain` restores the foreground curtain of 4ffb591 (2026-08-19, removed in
// 5d8a82d): the two foreground halves part to reveal more of the landscape.
// Historically hovering or focusing the title (or the hero waypoints) opened it
// and it closed 2.2 s after the pointer left. Without the waypoints, the title
// hover and keyboard focus in the hero copy open it fully, and scrolling into
// the page opens it progressively. Distances and easing are the historical
// ones (CSS); nothing moves with reduced motion.
const CURTAIN_REST_MS = 2200;
// Scroll distance, as a share of the hero height, over which the curtain opens.
const CURTAIN_REACH = 0.45;

// `still` (the audience routes, October 29) turns off the layered parallax: the
// sky, landscape, title and copy no longer move with the pointer or the scroll,
// and the copy no longer fades. The curtain is a separate effect and stays.
export default function Hero({ content, grouped = false, curtain = false, still = false }: { content: HeroContent; grouped?: boolean; curtain?: boolean; still?: boolean }) {
  const { portalOpen } = useVenture();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const copy = copyRef.current;
    if (!curtain || !hero || !title || !copy || portalOpen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let revealed = false;
    let scrolled = 0;
    let shown = 0;
    let frame = 0;
    let timer = 0;
    const paint = () => {
      frame = 0;
      const progress = motion.matches ? 0 : Math.max(scrolled, revealed ? 1 : 0);
      if (progress === shown) return;
      // Historical timing: opening 0.8 s, closing 1.4 s.
      hero.style.setProperty("--neo-curtain-duration", progress > shown ? ".8s" : "1.4s");
      hero.style.setProperty("--neo-curtain-progress", progress.toFixed(3));
      shown = progress;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const reveal = () => { window.clearTimeout(timer); revealed = true; schedule(); };
    const rest = () => { window.clearTimeout(timer); timer = window.setTimeout(() => { revealed = false; schedule(); }, CURTAIN_REST_MS); };
    const enterTitle = (event: PointerEvent) => { if (event.pointerType === "mouse" && finePointer.matches) reveal(); };
    const focusIn = (event: FocusEvent) => { if ((event.target as HTMLElement).matches(":focus-visible")) reveal(); };
    const focusOut = (event: FocusEvent) => { if (!copy.contains(event.relatedTarget as Node | null)) rest(); };
    const onScroll = () => {
      const reach = Math.max(hero.offsetHeight * CURTAIN_REACH, 1);
      scrolled = Math.min(Math.max(window.scrollY - hero.offsetTop, 0), reach) / reach;
      schedule();
    };
    title.addEventListener("pointerenter", enterTitle);
    title.addEventListener("pointerleave", rest);
    copy.addEventListener("focusin", focusIn);
    copy.addEventListener("focusout", focusOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", schedule);
    onScroll();
    return () => {
      title.removeEventListener("pointerenter", enterTitle);
      title.removeEventListener("pointerleave", rest);
      copy.removeEventListener("focusin", focusIn);
      copy.removeEventListener("focusout", focusOut);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", schedule);
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      hero.style.removeProperty("--neo-curtain-progress");
    };
  }, [curtain, portalOpen]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || portalOpen || still) return;
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
  }, [portalOpen, still]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || portalOpen || still) return;
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
  }, [portalOpen, still]);

  const supplement = (
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
  );

  return (
    <section className={curtain ? `${styles.hero} ${styles.heroCurtain}` : styles.hero} id="top" ref={heroRef}>
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
        <div className={styles.heroCopy} ref={copyRef}>
          <p className={styles.eyebrow}><span /><CopyText copy={content.eyebrow} before=" " /></p>
          <div ref={titleRef} className={[styles.heroTitle, content.title.long ? styles.heroTitleLong : "", content.title.plain ? styles.heroTitlePlain : ""].filter(Boolean).join(" ")}>
            <h1><span><CopyText copy={content.title.lead} /></span><br /><em><CopyText copy={content.title.em} /></em></h1>
          </div>
          {grouped && supplement}
        </div>
        {!grouped && supplement}
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
