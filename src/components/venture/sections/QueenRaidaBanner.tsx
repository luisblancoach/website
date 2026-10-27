"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QueenRaidaContent } from "@/lib/narrative/types";
import { CopyText, ReviewFlag } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import styles from "../audience.module.css";

// October 23 Queen Raida carousel (40f3910), kept as-is. The page passes
// `artworkAvailable` only when the artwork file exists, otherwise the frame
// shows its caption alone. Unconfirmed rights would outline the artwork in
// review builds.
export default function QueenRaidaBanner({ content, artworkAvailable }: { content: QueenRaidaContent; artworkAvailable: boolean }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const panels = content.panels;
  const panel = panels[active];
  const select = (index: number) => setActive((index + panels.length) % panels.length);
  const { artwork } = content;
  const frame = <div className={styles.raidaArtwork}>{artworkAvailable && <Image src={artwork.src} alt={artwork.alt.text} width={1200} height={900} priority sizes="(max-width: 700px) 100vw, 60vw" />}<small><CopyText copy={artwork.caption} /></small></div>;
  return <section id="raida" className={`${styles.section} ${styles.raida}`} aria-labelledby="raida-title" aria-roledescription="carousel">
    <div className={styles.raidaLayout}><div className={styles.raidaCopy}>
    <div className={styles.heading}><h2 id="raida-title"><CopyText copy={content.title.lead} /> <em><CopyText copy={content.title.em} /></em></h2><NarrativeAnchor link={content.cta} className={styles.textLink}><CopyText copy={content.cta.label} /> <ArrowRight size={20} aria-hidden="true" /></NarrativeAnchor></div>
    <p className={styles.raidaIntro}><CopyText copy={content.intro} /></p>
    <div role="tablist" aria-label="Explore Queen Raida" className={styles.tabs} onKeyDown={event => {
      const next = event.key === "ArrowRight" ? (active + 1) % panels.length : event.key === "ArrowLeft" ? (active + panels.length - 1) % panels.length : event.key === "Home" ? 0 : event.key === "End" ? panels.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); select(next); tabs.current[next]?.focus();
    }}>{panels.map((item, index) => <button ref={el => { tabs.current[index] = el; }} key={item.title.id} id={`raida-tab-${index}`} role="tab" type="button" aria-selected={active === index} aria-controls={`raida-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)}><CopyText copy={item.subtitle} /></button>)}</div>
    {panels.map((item, index) => <div key={item.title.id} hidden={active !== index} id={`raida-panel-${index}`} role="tabpanel" aria-labelledby={`raida-tab-${index}`} tabIndex={0} className={styles.raidaPanel}><h3><CopyText copy={item.title} /></h3><p><CopyText copy={item.copy} /></p><details><summary><CopyText copy={content.detailsLabel} /></summary><p><CopyText copy={item.detail} /></p></details></div>)}
    <div className={styles.controls}><button type="button" aria-label="Previous Raida panel" onClick={() => select(active - 1)}><ArrowLeft /></button><span aria-live="polite">{active + 1} / {panels.length}<span className="sr-only"> — {panel.subtitle.text}</span></span><button type="button" aria-label="Next Raida panel" onClick={() => select(active + 1)}><ArrowRight /></button></div></div>
    {artwork.rights.status === "approved" ? frame : <ReviewFlag id={artwork.rights.id} reason="claim" note={`${artwork.rights.text}. ${artwork.rights.note ?? ""}`.trim()} block>{frame}</ReviewFlag>}</div>
  </section>;
}
