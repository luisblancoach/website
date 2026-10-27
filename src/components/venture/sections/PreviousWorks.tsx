"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PreviousWorksContent } from "@/lib/narrative/types";
import { CopyText, ReviewFlag, useReviewFlags } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import styles from "../audience.module.css";

// October 23 previous works (40f3910): the featured project above a logo
// selector over the project archive. Until approved screenshots exist, the
// featured work shows its logo instead of an image placeholder. Pending works
// (no usable source yet) appear only where review flags do.
export default function PreviousWorks({ content }: { content: PreviousWorksContent }) {
  const reviewing = useReviewFlags();
  const works = content.works.filter((item) => !item.pending || reviewing);
  const [selected, setSelected] = useState(0);
  const [image, setImage] = useState(0);
  const logos = useRef<Array<HTMLButtonElement | null>>([]);
  const work = works[selected] ?? works[0];
  if (!work) return null;
  const choose = (index: number) => { setSelected(index); setImage(0); };
  // Arrow keys, Home and End move through the selector; Tab still reaches every logo.
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = works.length - 1;
    const next = event.key === "ArrowRight" ? (selected + 1) % works.length : event.key === "ArrowLeft" ? (selected + last) % works.length : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault(); choose(next); logos.current[next]?.focus();
  };
  const shown = work.images[image] ?? work.images[0];
  const copy = (
    <div className={styles.workCopy}><p><CopyText copy={work.company} /></p><h3><CopyText copy={work.title} /></h3>{work.description && <p><CopyText copy={work.description} /></p>}
      {work.tags.length > 0 && <details key={work.id}><summary><CopyText copy={content.detailsLabel} /></summary><p>{work.tags.map((tag, index) => <span key={tag.id}>{index > 0 && " · "}<CopyText copy={tag} /></span>)}</p></details>}
      <NarrativeAnchor link={content.cta} className={styles.textLink}><CopyText copy={content.cta.label} /> <ArrowRight size={18} aria-hidden="true" /></NarrativeAnchor>
    </div>
  );
  return <section id="case-studies" className={styles.section} aria-labelledby="previous-title">
    <div className={styles.heading}><h2 id="previous-title"><CopyText copy={content.title.lead} /> <em><CopyText copy={content.title.em} /></em></h2><p><CopyText copy={content.intro} /></p></div>
    <article id="featured-work" className={styles.featuredWork} aria-live="polite">
      {work.pending ? <ReviewFlag id={work.pending.id} reason="claim" note={`${work.pending.text}. ${work.pending.note ?? ""}`.trim()} block>{copy}</ReviewFlag> : copy}
      <div className={styles.workGallery}>
        {shown ? <><Image src={shown.src} alt={shown.alt.text} width={960} height={640} />
          {work.images.length > 1 && <div className={styles.controls}><button type="button" aria-label="Previous project image" onClick={() => setImage((image - 1 + work.images.length) % work.images.length)}><ArrowLeft /></button><span>{image + 1} / {work.images.length}</span><button type="button" aria-label="Next project image" onClick={() => setImage((image + 1) % work.images.length)}><ArrowRight /></button></div>}</>
          : <div className={styles.workLogoStage}><Image src={work.logo} alt="" width={320} height={108} aria-hidden="true" /></div>}
      </div>
    </article>
    <div className={styles.logoStrip} role="group" aria-label="Select a company" onKeyDown={move}>
      {works.map((item, index) => <button ref={(el) => { logos.current[index] = el; }} type="button" key={item.id} aria-pressed={selected === index} aria-controls="featured-work" onClick={() => choose(index)}><Image src={item.logo} alt={item.company.text} width={160} height={54} /></button>)}
    </div>
  </section>;
}
