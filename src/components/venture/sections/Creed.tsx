"use client";

import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import type { CreedContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import PillIcon, { pathGlyph } from "../primitives/PillIcon";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// The audience routes add the October 23 call to action under the creed. Its
// icon matches the equivalent hero action: ↓ for a section on the page, → for
// the Portal.
export default function Creed({ content }: { content?: CreedContent }) {
  const { label, statement } = useVenture().site.creed;
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
        <p className={styles.sectionLabel}><CopyText copy={label} /></p>
        <blockquote><CopyText copy={statement.lead} after=" " /><em><CopyText copy={statement.em} /></em></blockquote>
        {content && (
          <NarrativeAnchor link={content.cta} className={`${styles.pill} ${styles.pillFilled} ${styles.creedCta}`}>
            <span><CopyText copy={content.cta.label} /></span><PillIcon glyph={pathGlyph(content.cta.section ? "↓" : "→", content.cta)} />
          </NarrativeAnchor>
        )}
      </div>
      {/* Audience routes (October 30, late night): the walker's mark moved to the
          footer, so nothing competes with the creed's call to action. */}
      {!content && <div className={styles.unchartedWalker}><HuntPixel artifact="walker" /><HuntMarker artifact="walker" label="A mark left by the walker" /></div>}
    </section>
  );
}
