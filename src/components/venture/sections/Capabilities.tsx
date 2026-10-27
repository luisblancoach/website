"use client";

import Image from "next/image";
import type { CapabilitiesContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// October 23 services & capabilities (40f3910): the published services as an
// accordion, with the specialist practices behind a disclosure. The section
// keeps the "spears" id for existing links; "services" and "capabilities" are
// anchors for the October 23 and narrative navigation.
export default function Capabilities({ content }: { content: CapabilitiesContent }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.practice} ${arrivalTarget === "spears" || arrivalTarget === "capabilities" ? styles.sectionArriving : ""}`} id="spears">
      <span id="services" className={styles.anchorTarget} />
      <span id="capabilities" className={styles.anchorTarget} />
      <div className={styles.practiceHeading}>
        <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
        <h2><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <div className={styles.practiceAside}>
          <p><CopyText copy={content.intro} /></p>
          <NarrativeAnchor link={content.inquiry} className={`${styles.pill} ${styles.pillOutlineNavy}`}>
            <span><CopyText copy={content.inquiry.label} /></span>
            <i className={styles.pillIcon}><b className={styles.iconLogo} /></i>
          </NarrativeAnchor>
        </div>
      </div>
      <div className={styles.capabilities}>
        {content.services.map((service) => (
          <details key={service.title.id}><summary><CopyText copy={service.title} /><span aria-hidden="true">+</span></summary><p><CopyText copy={service.body} /></p></details>
        ))}
      </div>
      <details className={styles.practiceDisclosure}>
        <summary><CopyText copy={content.practicesLabel} /></summary>
        <div className={styles.practiceCards}>
          {content.practices.map((item) => (
            <article className={styles.practiceCard} key={item.title.id}>
              <Image src={item.image.src} alt={item.image.alt.text} width={1024} height={768} />
              <div>
                <p className={styles.disciplineTag}><CopyText copy={item.tag} /></p>
                <h3><CopyText copy={item.title} /></h3>
                <p><CopyText copy={item.body} /></p>
                <NarrativeAnchor link={item.link}><CopyText copy={item.link.label} /> <span>↗</span></NarrativeAnchor>
              </div>
            </article>
          ))}
        </div>
      </details>
      <p className={styles.practiceGeneral}><CopyText copy={content.footnote.lead} after=" " /><NarrativeAnchor link={content.footnote.link}><CopyText copy={content.footnote.link.label} /></NarrativeAnchor></p>
    </section>
  );
}
