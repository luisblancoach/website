"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { caseStudyButtonSize, caseStudySnapshotSize } from "@/lib/data/caseStudies";
import type { PreviousWorksContent } from "@/lib/narrative/types";
import { CopyText, ReviewFlag, useReviewFlags } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import LogoMarquee from "../primitives/LogoMarquee";
import audience from "../audience.module.css";
import venture from "../venture.module.css";
import styles from "../showcase.module.css";

// October 27 client showcase: the selected project's screenshot and details
// above a looping logo marquee (desktop), or between two marquees running in
// opposite directions (mobile). Every marquee and the previous/next controls
// share one selection. Pending works appear only where review flags do.
export default function PreviousWorks({ content }: { content: PreviousWorksContent }) {
  const reviewing = useReviewFlags();
  const works = content.works.filter((item) => !item.pending || reviewing);
  const [selected, setSelected] = useState(0);
  const work = works[selected] ?? works[0];
  if (!work) return null;
  const step = (delta: number) => setSelected((selected + delta + works.length) % works.length);
  const items = works.map((item) => ({ id: item.id, label: item.name.text, src: item.button, ...caseStudyButtonSize }));
  const marquee = { items, selected, onSelect: setSelected, label: content.selectLabel, controls: "featured-work" };

  const details = (
    <div className={styles.workCopy}>
      <h3><CopyText copy={work.name} /></h3>
      {work.title && <p className={styles.workTitle}><CopyText copy={work.title} /></p>}
      {work.description && <p className={styles.workDescription}><CopyText copy={work.description} /></p>}
      <NarrativeAnchor link={work.link} className={styles.readMore}>
        <CopyText copy={work.link.label} /><span className={styles.srOnly}> about {work.name.text} (opens the {work.name.text} website)</span>
      </NarrativeAnchor>
      <NarrativeAnchor link={content.cta} className={`${venture.pill} ${venture.pillFilled} ${styles.workCta}`}>
        <span><CopyText copy={content.cta.label} /></span>
        <i className={venture.pillIcon} aria-hidden="true"><b className={venture.iconLogo} /></i>
      </NarrativeAnchor>
    </div>
  );

  return (
    <section id="case-studies" className={`${audience.section} ${styles.showcase}`} aria-labelledby="previous-title">
      <h2 id="previous-title" className={styles.showcaseTitle}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
      <div className={styles.showcaseStage}>
        <LogoMarquee {...marquee} className={styles.marqueePrimary} />
        <div className={styles.featured}>
          <button type="button" className={styles.stepButton} aria-label="Previous project" aria-controls="featured-work" onClick={() => step(-1)}><ChevronLeft aria-hidden="true" /></button>
          <article id="featured-work" className={styles.work} aria-labelledby="featured-work-name">
            <p className={styles.srOnly} aria-live="polite" id="featured-work-name">{work.name.text}, project {selected + 1} of {works.length}</p>
            <div className={styles.snapshot}>
              <Image key={work.id} src={work.snapshot.src} alt={work.snapshot.alt.text} {...caseStudySnapshotSize} sizes="(max-width: 760px) calc(100vw - 48px), 640px" />
            </div>
            {work.pending ? <ReviewFlag id={work.pending.id} reason="claim" note={`${work.pending.text}. ${work.pending.note ?? ""}`.trim()} block>{details}</ReviewFlag> : details}
          </article>
          <button type="button" className={styles.stepButton} aria-label="Next project" aria-controls="featured-work" onClick={() => step(1)}><ChevronRight aria-hidden="true" /></button>
        </div>
        <LogoMarquee {...marquee} reverse decorative className={styles.marqueeSecondary} />
      </div>
    </section>
  );
}
