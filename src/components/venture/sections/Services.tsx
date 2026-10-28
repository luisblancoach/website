"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { Illustration } from "@/lib/data/illustrations";
import type { ServicesContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import venture from "../venture.module.css";
import showcase from "../showcase.module.css";
import styles from "../services.module.css";

// October 27 services ("What are you trying to ship?"): the published services
// accordion and the foundry illustration as separate regions. Desktop shows the
// portrait cut beside the copy; mobile shows the horizontal cut above it. Keeps
// the "spears", "services" and "capabilities" anchors used by navigation.
export default function Services({ content, portrait, horizontal }: { content: ServicesContent; portrait: Illustration; horizontal: Illustration }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.services} ${arrivalTarget === "spears" || arrivalTarget === "capabilities" ? venture.sectionArriving : ""}`} id="spears" aria-labelledby="services-title">
      <span id="services" className={venture.anchorTarget} />
      <span id="capabilities" className={venture.anchorTarget} />
      <div className={styles.layout}>
        <Image className={styles.artHorizontal} src={horizontal.src} alt="" width={horizontal.width} height={horizontal.height} sizes="(max-width: 760px) calc(100vw - 48px), 360px" aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.label}><CopyText copy={content.label} /></p>
          <h2 id="services-title" className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
          <div className={styles.intro}>{content.intro.map((paragraph) => <p key={paragraph.id}><CopyText copy={paragraph} /></p>)}</div>
          <div className={styles.accordion}>
            {content.services.map((service) => (
              <details key={service.title.id}>
                <summary><i className={`${venture.serviceMark} ${styles.mark}`} aria-hidden="true" /><span className={styles.row}><span><CopyText copy={service.title} /></span><ChevronDown className={styles.chevron} aria-hidden="true" /></span></summary>
                <p><CopyText copy={service.body} /></p>
              </details>
            ))}
          </div>
          <NarrativeAnchor link={content.cta} className={`${venture.pill} ${venture.pillFilled} ${showcase.compactPill} ${styles.cta}`}>
            <span><CopyText copy={content.cta.label} /></span>
            <i className={venture.pillIcon} aria-hidden="true"><b className={venture.iconLogo} /></i>
          </NarrativeAnchor>
          <p className={styles.footnote}><CopyText copy={content.footnote.lead} after=" " /><NarrativeAnchor link={content.footnote.link}><CopyText copy={content.footnote.link.label} /></NarrativeAnchor></p>
        </div>
        <Image className={styles.artPortrait} src={portrait.src} alt="" width={portrait.width} height={portrait.height} sizes="520px" aria-hidden="true" />
      </div>
    </section>
  );
}
