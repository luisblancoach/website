"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
// `rotate` (/clients) advances to the next project every few seconds, with a
// short crossfade. It pauses while the mouse is over the showcase or keyboard
// focus is inside it, while it is offscreen or the tab is hidden, and never runs with
// reduced motion. Any manual choice restarts the interval; only manual changes
// are announced, so the rotation does not speak every few seconds.
const ROTATE_MS = 3000;

export default function PreviousWorks({ content, rotate = false }: { content: PreviousWorksContent; rotate?: boolean }) {
  const reviewing = useReviewFlags();
  const works = content.works.filter((item) => !item.pending || reviewing);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [announce, setAnnounce] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rotate) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(motion.matches);
    update();
    motion.addEventListener("change", update);
    const section = sectionRef.current;
    const observer = section ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 }) : null;
    if (section) observer?.observe(section);
    return () => { motion.removeEventListener("change", update); observer?.disconnect(); };
  }, [rotate]);

  const count = works.length;
  useEffect(() => {
    if (!rotate || still || hovering || focused || !visible || count < 2) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      setPrevious(selected);
      setSelected((selected + 1) % count);
      setAnnounce(false);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [rotate, still, hovering, focused, visible, count, selected]);

  const work = works[selected] ?? works[0];
  if (!work) return null;
  const choose = (index: number) => {
    if (index === selected) return;
    setPrevious(selected);
    setSelected(index);
    setAnnounce(true);
  };
  const step = (delta: number) => choose((selected + delta + works.length) % works.length);
  const items = works.map((item) => ({ id: item.id, label: item.name.text, src: item.button, ...caseStudyButtonSize }));
  const marquee = { items, selected, onSelect: choose, label: content.selectLabel, controls: "featured-work" };
  const outgoing = rotate && previous !== null && previous !== selected ? works[previous] : undefined;

  const details = (
    <div className={styles.workCopy} key={rotate ? work.id : undefined} data-fade={rotate ? "" : undefined}>
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
    <section
      ref={sectionRef}
      id="case-studies"
      className={`${audience.section} ${styles.showcase}`}
      aria-labelledby="previous-title"
      onFocus={rotate ? (event) => { if ((event.target as HTMLElement).matches(":focus-visible")) setFocused(true); } : undefined}
      onBlur={rotate ? (event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); } : undefined}
    >
      <h2 id="previous-title" className={styles.showcaseTitle}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
      <div
        className={styles.showcaseStage}
        onPointerEnter={rotate ? (event) => { if (event.pointerType === "mouse") setHovering(true); } : undefined}
        onPointerLeave={rotate ? (event) => { if (event.pointerType === "mouse") setHovering(false); } : undefined}
      >
        <LogoMarquee {...marquee} className={styles.marqueePrimary} />
        <div className={styles.featured}>
          <button type="button" className={styles.stepButton} aria-label="Previous project" aria-controls="featured-work" onClick={() => step(-1)}><ChevronLeft aria-hidden="true" /></button>
          <article id="featured-work" className={styles.work} aria-labelledby="featured-work-name">
            <p className={styles.srOnly} aria-live={rotate && !announce ? "off" : "polite"} id="featured-work-name">{work.name.text}, project {selected + 1} of {works.length}</p>
            <div className={styles.snapshot}>
              {outgoing && <Image key={`out-${outgoing.id}`} className={styles.snapshotOutgoing} src={outgoing.snapshot.src} alt="" aria-hidden="true" {...caseStudySnapshotSize} sizes="(max-width: 760px) calc(100vw - 48px), 640px" />}
              <Image key={work.id} className={rotate ? styles.snapshotIncoming : undefined} src={work.snapshot.src} alt={work.snapshot.alt.text} {...caseStudySnapshotSize} sizes="(max-width: 760px) calc(100vw - 48px), 640px" />
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
