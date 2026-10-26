"use client";

import Image from "next/image";
import HireUs from "@/components/HireUs";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function GuildInquiry() {
  const { arrivalTarget, inquiryExpanded, setInquiryExpanded } = useVenture();
  return (
    <section className={`${styles.contact} ${inquiryExpanded ? styles.contactExpanded : ""} ${arrivalTarget === "contact" ? styles.sectionArriving : ""}`} id="contact">
      <div className={styles.contactIntro}>
        <Image className={styles.contactDruid} src="/images/neo/contact-druid-transparent.png" alt="Four Guild characters with maps, tools, and a staff" width={768} height={1024} sizes="(max-width: 600px) 70vw, 420px" />
        <div className={styles.contactCopy}>
          <p className={styles.sectionLabel}>[ BEGIN A TRANSMISSION ]</p>
          <h2 className={styles.contactHeadline}>Find your <em>starting point.</em></h2>
          <p className={styles.contactDek}>Start with a specialist practice above. If the fit is unclear, send the Guild a short inquiry.</p>
          <div className={styles.contactClue}><HuntPixel artifact="signal" /><HuntMarker artifact="signal" label="A signal near the inquiry" /></div>
        </div>
      </div>
      <details className={styles.inquiryMore} id="project-inquiry" tabIndex={-1} open={inquiryExpanded} onToggle={(event) => setInquiryExpanded(event.currentTarget.open)}>
        <summary>Start a Guild inquiry <span>{inquiryExpanded ? "Close the inquiry ↑" : "Share a project or question ↓"}</span></summary>
        <div className={styles.contactFormShell}>
          <div className={styles.formCoordinates}><span>RG—INTAKE / 001</span><span>ENCRYPTION: OPEN</span></div>
          <HireUs />
        </div>
      </details>
    </section>
  );
}
