"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import HireUs from "@/components/HireUs";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import { entryInquiry } from "@/lib/narrative/entry";
import type { InquiryContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// With `content`, the audience routes' inquiry and the October 23 guided form;
// "/" keeps its entry copy and current form. `surface="cyan"` sets the panel on
// the light-blue brand surface in the light theme (/clients, October 28) and
// makes the module show one state at a time: the introduction, or the form in
// its place (Frame 122). The form stays mounted while closed, so entered values
// survive closing and reopening.
export default function GuildInquiry({ content, surface }: { content?: InquiryContent; surface?: "cyan" }) {
  const copy = content ?? entryInquiry;
  const { arrivalTarget, inquiryExpanded, setInquiryExpanded } = useVenture();
  const replaces = surface === "cyan";
  const summaryRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const wasExpanded = useRef(inquiryExpanded);

  // The introduction and its button disappear when the form opens, so focus
  // moves to the form, and back to the button when it closes.
  useEffect(() => {
    if (!replaces || wasExpanded.current === inquiryExpanded) return;
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
  }, [inquiryExpanded, replaces]);

  // The module opens through state, not the native toggle, so the
  // introduction and the form change in the same frame.
  const close = () => setInquiryExpanded(false);

  return (
    <section className={`${styles.contact} ${surface === "cyan" ? styles.contactCyan : ""} ${inquiryExpanded ? styles.contactExpanded : ""} ${arrivalTarget === "contact" ? styles.sectionArriving : ""}`} id="contact">
      <div className={styles.contactIntro}>
        <Image className={styles.contactDruid} src="/images/neo/contact-druid-transparent.png" alt={copy.image.alt.text} width={768} height={1024} sizes="(max-width: 600px) 70vw, 420px" />
        <div className={styles.contactCopy}>
          <p className={styles.sectionLabel}><CopyText copy={copy.label} /></p>
          <h2 className={styles.contactHeadline}><CopyText copy={copy.title.lead} after=" " /><em><CopyText copy={copy.title.em} /></em></h2>
          <p className={styles.contactDek}><CopyText copy={copy.body} /></p>
          <div className={styles.contactClue}><HuntPixel artifact="signal" /><HuntMarker artifact="signal" label="A signal near the inquiry" /></div>
        </div>
      </div>
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
    </section>
  );
}
