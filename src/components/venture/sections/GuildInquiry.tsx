"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import HireUs, { type InquiryProgress } from "@/components/HireUs";
import { fixedNavBottom, revealBelowNav } from "@/lib/inquiry-scroll";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import { entryInquiry } from "@/lib/narrative/entry";
import type { InquiryContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import { ContactGallerySlot, ContactScene, ProfessionGallery } from "./ContactScene";
import styles from "../venture.module.css";

// With `content`, the audience routes' inquiry and the October 23 guided form;
// "/" keeps its entry copy and current form. `surface="cyan"` sets the panel on
// the light-blue brand surface in the light theme (/clients, October 28) and
// makes the module show one state at a time: the introduction, or the form in
// its place (Frame 122). The form stays mounted while closed, so entered values
// survive closing and reopening. October 30: on the audience routes the Venture
// Beyond scene and the profession gallery replace the single illustration, as
// on the /community Join module (ContactScene); "/" keeps the illustration.
// October 30 (late night): on the audience routes the form is the conversion,
// so it is open from the start, below the introduction in the same panel: no
// trigger, no close link, and it grows downward. The hunt's signal clue moved
// to the footer (SiteFooter) to keep the form free of distractions; "/" keeps
// its trigger and clue.
export default function GuildInquiry({ content, surface }: { content?: InquiryContent; surface?: "cyan" }) {
  const copy = content ?? entryInquiry;
  const { arrivalTarget, inquiryExpanded, setInquiryExpanded } = useVenture();
  const replaces = surface === "cyan";
  const open = Boolean(content);
  const summaryRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const wasExpanded = useRef(inquiryExpanded);

  // November 11: on the audience routes the heading follows the form. Step 1
  // shows the full introduction; steps 2 and 3 only the label (the title stays
  // for assistive technology), with the form's stepper below it; after a
  // successful inquiry the label reads "[ Transmission Started ]" and the
  // title becomes THE FIRES / HAVE BEEN LIT!, with the opening title's
  // treatment. The heading is kept below the fixed bar when the step changes,
  // and the confirmation title takes focus. New copy, pending Tae's review.
  const [progress, setProgress] = useState<InquiryProgress>({ step: 0, status: "idle" });
  const onProgress = useCallback((next: InquiryProgress) => setProgress((current) => (current.step === next.step && current.status === next.status ? current : next)), []);
  const headerRef = useRef<HTMLDivElement>(null);
  const doneTitleRef = useRef<HTMLHeadingElement>(null);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const shown = useRef(progress);
  const done = open && progress.status === "success";
  const compact = open && !done && progress.step > 0;
  useLayoutEffect(() => {
    const before = shown.current;
    shown.current = progress;
    const header = headerRef.current;
    if (!open || !header) return;
    if (progress.status === "success" && before.status !== "success") {
      doneTitleRef.current?.focus({ preventScroll: true });
      revealBelowNav(header, 16, inquiryRef.current ?? undefined);
    } else if (progress.step !== before.step && progress.status !== "success") {
      const top = header.getBoundingClientRect().top;
      if (top < fixedNavBottom() + 16 || top > window.innerHeight * 0.6) revealBelowNav(header);
    }
  }, [progress, open]);

  // The introduction and its button disappear when the form opens, so focus
  // moves to the form, and back to the button when it closes.
  useEffect(() => {
    if (open || !replaces || wasExpanded.current === inquiryExpanded) return;
    wasExpanded.current = inquiryExpanded;
    const frame = requestAnimationFrame(() => {
      if (inquiryExpanded) {
        const form = formRef.current;
        if (!form || form.contains(document.activeElement)) return;
        form.focus({ preventScroll: true });
        if (form.getBoundingClientRect().top < 0) form.closest("details")?.scrollIntoView({ block: "start" });
      } else {
        summaryRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [inquiryExpanded, open, replaces]);

  // The module opens through state, not the native toggle, so the
  // introduction and the form change in the same frame.
  const close = () => setInquiryExpanded(false);

  return (
    <section className={`${styles.contact} ${surface === "cyan" ? styles.contactCyan : ""} ${!open && inquiryExpanded ? styles.contactExpanded : ""} ${arrivalTarget === "contact" ? styles.sectionArriving : ""}`} id="contact">
      {content && <ContactScene><ProfessionGallery /></ContactScene>}
      <div className={styles.contactIntro}>
        {content
          ? <ContactGallerySlot />
          : <Image className={styles.contactDruid} src="/images/neo/contact-druid-transparent.png" alt={copy.image.alt.text} width={768} height={1024} sizes="(max-width: 600px) 70vw, 420px" />}
        <div className={styles.contactCopy} ref={headerRef} data-inquiry-header={open ? "" : undefined} data-compact={compact || undefined} data-done={done || undefined}>
          {done ? (
            <>
              <p className={styles.sectionLabel}>[ Transmission Started ]</p>
              <h2 className={`${styles.contactHeadline} ${styles.contactDone}`} tabIndex={-1} ref={doneTitleRef}><span>The Fires</span>{" "}<em>Have Been Lit!</em></h2>
            </>
          ) : (
            <>
              <p className={styles.sectionLabel}><CopyText copy={copy.label} /></p>
              <h2 className={`${styles.contactHeadline} ${compact ? "sr-only" : ""}`}><CopyText copy={copy.title.lead} after=" " /><em><CopyText copy={copy.title.em} /></em></h2>
              {!compact && <p className={styles.contactDek}><CopyText copy={copy.body} /></p>}
            </>
          )}
          {!content && <div className={styles.contactClue}><HuntPixel artifact="signal" /><HuntMarker artifact="signal" label="A signal near the inquiry" /></div>}
        </div>
      </div>
      {open ? (
        // Audience routes: always open, so a plain container (a <details>
        // without its summary would draw the browser's own "Details" toggle).
        <div className={styles.inquiryMore} id="project-inquiry" tabIndex={-1} ref={inquiryRef}>
          <div className={styles.contactFormShell} ref={formRef} role="group" aria-label={copy.summary.label.text} data-inquiry-form="" data-inquiry-done={done || undefined}>
            <HireUs guided onProgress={onProgress} />
          </div>
        </div>
      ) : (
        <details className={styles.inquiryMore} id="project-inquiry" tabIndex={-1} open={inquiryExpanded} onToggle={(event) => setInquiryExpanded(event.currentTarget.open)}>
          <summary ref={summaryRef} onClick={replaces ? (event) => { event.preventDefault(); setInquiryExpanded(!inquiryExpanded); } : undefined}><CopyText copy={copy.summary.label} after=" " /><span><CopyText copy={inquiryExpanded ? copy.summary.hintOpen : copy.summary.hint} /></span></summary>
          <div className={styles.contactFormShell} ref={formRef} tabIndex={replaces ? -1 : undefined} role={replaces ? "group" : undefined} aria-label={replaces ? copy.summary.label.text : undefined} data-inquiry-form={replaces ? "" : undefined}>
            {replaces ? (
              <div className={styles.inquiryFormBar}>
                <button type="button" className={styles.inquiryClose} onClick={close}><CopyText copy={copy.summary.hintOpen} /></button>
              </div>
            ) : (
              <div className={styles.formCoordinates}><span><CopyText copy={copy.coordinates[0]} /></span><span><CopyText copy={copy.coordinates[1]} /></span></div>
            )}
            <HireUs guided={Boolean(content)} onExit={replaces ? close : undefined} />
          </div>
        </details>
      )}
    </section>
  );
}
