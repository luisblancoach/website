"use client";

import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import styles from "../venture.module.css";

export default function Creed() {
  return (
    <section className={styles.creed}>
      <video
        className={styles.creedMoons}
        poster="/images/neo/manifesto-backdrop.png"
        src="/videos/venture/manifesto-crossfade.mp4"
        data-scene="manifesto"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.creedContent}>
        <p className={styles.sectionLabel}>[ THE RAIDGUILD CREED ]</p>
        <blockquote>The future is not something to predict. It is something to <em>build.</em></blockquote>
      </div>
      <div className={styles.unchartedWalker}><HuntPixel artifact="walker" /><HuntMarker artifact="walker" label="A mark left by the walker" /></div>
    </section>
  );
}
