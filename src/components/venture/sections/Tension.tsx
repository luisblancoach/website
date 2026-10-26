"use client";

import type { TensionContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function Tension({ content }: { content: TensionContent }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.tension} ${arrivalTarget === "tension" ? styles.sectionArriving : ""}`} id="tension" aria-labelledby="tension-heading">
      <header className={styles.narrativeHeading}>
        <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
        <h2 id="tension-heading"><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
      </header>
      <div className={styles.tensionSides}>
        {content.sides.map((side) => (
          <article key={side.heading.id} className={`${styles.tensionSide} ${side.owned ? styles.tensionOwned : ""}`}>
            <h3><CopyText copy={side.heading} /></h3>
            <ul>
              {side.points.map((point) => <li key={point.id}><CopyText copy={point} /></li>)}
            </ul>
          </article>
        ))}
        <span className={styles.tensionVersus} aria-hidden="true">VS</span>
      </div>
    </section>
  );
}
