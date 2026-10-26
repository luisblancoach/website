"use client";

import type { PathContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// A three-beat narrative path. Steps are a framework for the story, not a
// promised sequence; the framing line says so on the page.
export default function PathSteps({ id, content }: { id: "path"; content: PathContent }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.pathSection} ${arrivalTarget === id ? styles.sectionArriving : ""}`} id={id} aria-labelledby={`${id}-heading`}>
      <header className={styles.narrativeHeading}>
        <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
        <h2 id={`${id}-heading`}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <p className={styles.narrativeIntro}><CopyText copy={content.framing} /></p>
      </header>
      <ol className={styles.pathSteps}>
        {content.steps.map((step, index) => (
          <li key={step.title.id} className={styles.pathStep}>
            <span className={styles.pathIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3><CopyText copy={step.title} /></h3>
            <p><CopyText copy={step.body} /></p>
          </li>
        ))}
      </ol>
      <p className={styles.pathFootnote}>
        <NarrativeAnchor link={content.footnote} className={styles.handbookLink}><CopyText copy={content.footnote.label} /></NarrativeAnchor>
      </p>
    </section>
  );
}
