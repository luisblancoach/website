"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PreviousWorksContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import styles from "../audience.module.css";

// October 23 previous works (40f3910): a logo selector over the existing project
// archive. Until approved screenshots exist, the featured work shows its logo
// instead of an image placeholder.
export default function PreviousWorks({ content }: { content: PreviousWorksContent }) {
  const [selected, setSelected] = useState(0);
  const [image, setImage] = useState(0);
  const works = content.works;
  const work = works[selected] ?? works[0];
  if (!work) return null;
  const choose = (index: number) => { setSelected(index); setImage(0); };
  const shown = work.images[image] ?? work.images[0];
  return <section id="case-studies" className={styles.section} aria-labelledby="previous-title">
    <div className={styles.heading}><h2 id="previous-title"><CopyText copy={content.title.lead} /> <em><CopyText copy={content.title.em} /></em></h2><p><CopyText copy={content.intro} /></p></div>
    <div className={styles.logoStrip} role="group" aria-label="Select a company">
      {works.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="featured-work" onClick={() => choose(index)}><Image src={item.logo} alt={item.company.text} width={160} height={54} /></button>)}
    </div>
    <article id="featured-work" className={styles.featuredWork} aria-live="polite">
      <div className={styles.workCopy}><p><CopyText copy={work.company} /></p><h3><CopyText copy={work.title} /></h3><p><CopyText copy={work.description} /></p>
        <details key={work.id}><summary><CopyText copy={content.detailsLabel} /></summary><p>{work.tags.map((tag, index) => <span key={tag.id}>{index > 0 && " · "}<CopyText copy={tag} /></span>)}</p></details>
        <NarrativeAnchor link={content.cta} className={styles.textLink}><CopyText copy={content.cta.label} /> <ArrowRight size={18} aria-hidden="true" /></NarrativeAnchor>
      </div>
      <div className={styles.workGallery}>
        {shown ? <><Image src={shown.src} alt={shown.alt.text} width={960} height={640} />
          {work.images.length > 1 && <div className={styles.controls}><button type="button" aria-label="Previous project image" onClick={() => setImage((image - 1 + work.images.length) % work.images.length)}><ArrowLeft /></button><span>{image + 1} / {work.images.length}</span><button type="button" aria-label="Next project image" onClick={() => setImage((image + 1) % work.images.length)}><ArrowRight /></button></div>}</>
          : <div className={styles.workLogoStage}><Image src={work.logo} alt="" width={320} height={108} aria-hidden="true" /></div>}
      </div>
    </article>
  </section>;
}
