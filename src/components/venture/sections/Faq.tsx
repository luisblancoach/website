"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Illustration } from "@/lib/data/illustrations";
import type { Copy, FaqContent } from "@/lib/narrative/types";
import { CopyText, ReviewFlag } from "../primitives/Review";
import styles from "../gallery.module.css";

// November 2 FAQ (/clients before the inquiry, /community before Join). Each
// question is a heading holding a disclosure button (aria-expanded, controls
// its answer), so the list is navigable by headings and every answer opens
// with Enter or Space. Bracketed segments ("[$X–$Y]") are values the owner has
// not supplied: they render as marked placeholders with a hidden "to be
// confirmed" note, never as facts.
// November 3 Figma pass: an optional decorative illustration beside the list
// (from 1000 px; hidden below, where the list takes the full column).
// November 3 (owner): the plus / minus sign became a chevron, the same marker
// as the /clients reason rows; it turns when the answer opens.
function Answer({ copy }: { copy: Copy }) {
  if (!/\[[^\]]+\]/.test(copy.text)) return <CopyText copy={copy} />;
  const parts = copy.text.split(/(\[[^\]]+\])/g).filter(Boolean).map((part, index) => part.startsWith("[")
    ? <mark key={index} className={styles.placeholder} title="Placeholder: value to be confirmed"><span className={styles.srOnly}>Placeholder, to be confirmed: </span>{part}</mark>
    : <span key={index}>{part}</span>);
  return copy.status === "approved" ? <>{parts}</> : <ReviewFlag id={copy.id} reason={copy.reason ?? "claim"} note={copy.note}>{parts}</ReviewFlag>;
}

export default function Faq({ id, content, illustration }: { id: string; content: FaqContent; illustration?: Illustration }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id={id} className={styles.faq} aria-labelledby={`${id}-title`}>
      <div className={styles.faqHead}>
        {content.label && <p className={styles.label}><CopyText copy={content.label} /></p>}
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
                  <ChevronDown className={styles.chevron} aria-hidden="true" focusable="false" />
                </button>
              </h3>
              <div id={`${base}-a${index}`} role="region" aria-labelledby={`${base}-q${index}`} className={styles.faqAnswer} hidden={!expanded}>
                <p><Answer copy={item.answer} /></p>
              </div>
            </div>
          );
        })}
      </div>
      {illustration && <div className={styles.faqArt} aria-hidden="true"><Image src={illustration.src} alt="" width={illustration.width} height={illustration.height} sizes="540px" /></div>}
    </section>
  );
}
