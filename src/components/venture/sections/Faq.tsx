"use client";

import { useId, useState } from "react";
import type { Copy, FaqContent } from "@/lib/narrative/types";
import { CopyText, ReviewFlag } from "../primitives/Review";
import styles from "../gallery.module.css";

// November 2 FAQ (/clients before the inquiry, /community before Join). Each
// question is a heading holding a disclosure button (aria-expanded, controls
// its answer), so the list is navigable by headings and every answer opens
// with Enter or Space. Bracketed segments ("[$X–$Y]") are values the owner has
// not supplied: they render as marked placeholders with a hidden "to be
// confirmed" note, never as facts.
function Answer({ copy }: { copy: Copy }) {
  if (!/\[[^\]]+\]/.test(copy.text)) return <CopyText copy={copy} />;
  const parts = copy.text.split(/(\[[^\]]+\])/g).filter(Boolean).map((part, index) => part.startsWith("[")
    ? <mark key={index} className={styles.placeholder} title="Placeholder: value to be confirmed"><span className={styles.srOnly}>Placeholder, to be confirmed: </span>{part}</mark>
    : <span key={index}>{part}</span>);
  return copy.status === "approved" ? <>{parts}</> : <ReviewFlag id={copy.id} reason={copy.reason ?? "claim"} note={copy.note}>{parts}</ReviewFlag>;
}

export default function Faq({ id, content }: { id: string; content: FaqContent }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id={id} className={styles.faq} aria-labelledby={`${id}-title`}>
      <div className={styles.faqHead}>
        <p className={styles.label}><CopyText copy={content.label} /></p>
        <h2 id={`${id}-title`} className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
      </div>
      <div className={styles.faqList}>
        {content.items.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.question.id} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                <button type="button" id={`${base}-q${index}`} aria-expanded={expanded} aria-controls={`${base}-a${index}`} onClick={() => setOpen(expanded ? null : index)}>
                  <span><CopyText copy={item.question} /></span>
                  <i className={styles.faqSign} aria-hidden="true" />
                </button>
              </h3>
              <div id={`${base}-a${index}`} role="region" aria-labelledby={`${base}-q${index}`} className={styles.faqAnswer} hidden={!expanded}>
                <p><Answer copy={item.answer} /></p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
