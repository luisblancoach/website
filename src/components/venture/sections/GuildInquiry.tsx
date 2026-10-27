"use client";

import Image from "next/image";
import HireUs from "@/components/HireUs";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import { entryInquiry } from "@/lib/narrative/entry";
import type { InquiryContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// With `content`, the audience routes' inquiry and the October 23 guided form;
// "/" keeps its entry copy and current form.
export default function GuildInquiry({ content }: { content?: InquiryContent }) {
  const copy = content ?? entryInquiry;
  const { arrivalTarget, inquiryExpanded, setInquiryExpanded } = useVenture();
  return (
    <section className={`${styles.contact} ${inquiryExpanded ? styles.contactExpanded : ""} ${arrivalTarget === "contact" ? styles.sectionArriving : ""}`} id="contact">
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
        <summary><CopyText copy={copy.summary.label} after=" " /><span><CopyText copy={inquiryExpanded ? copy.summary.hintOpen : copy.summary.hint} /></span></summary>
        <div className={styles.contactFormShell}>
          <div className={styles.formCoordinates}><span><CopyText copy={copy.coordinates[0]} /></span><span><CopyText copy={copy.coordinates[1]} /></span></div>
          <HireUs guided={Boolean(content)} />
        </div>
      </details>
    </section>
  );
}
