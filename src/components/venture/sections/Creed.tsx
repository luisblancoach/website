"use client";

import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import type { CreedContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import styles from "../venture.module.css";

// The audience routes add the October 23 call to action under the creed.
export default function Creed({ content }: { content?: CreedContent }) {
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
        {content && (
          <NarrativeAnchor link={content.cta} className={`${styles.pill} ${styles.pillFilled} ${styles.creedCta}`}>
            <span><CopyText copy={content.cta.label} /></span><i className={styles.pillIcon} aria-hidden="true">↗</i>
          </NarrativeAnchor>
        )}
      </div>
      <div className={styles.unchartedWalker}><HuntPixel artifact="walker" /><HuntMarker artifact="walker" label="A mark left by the walker" /></div>
    </section>
  );
}
