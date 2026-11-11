"use client";

import Image from "next/image";
import { activeSpears } from "@/lib/data/venture";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function ActiveSpears() {
  const { arrivalTarget, followInquiryLink, sectionHref } = useVenture();
  return (
    <section className={`${styles.practice} ${arrivalTarget === "spears" ? styles.sectionArriving : ""}`} id="spears">
      <div className={styles.practiceHeading}>
        <p className={styles.sectionLabel}>[ ACTIVE SPEARS ]</p>
        <h2>Specialized at<br /><em>the applied edge</em></h2>
        <div className={styles.practiceAside}>
          <p>The Guild is the center of gravity. These independently led practices are its tips of the spear, turning shared experience into focused offerings with their own teams and direction.</p>
          <a className={`${styles.pill} ${styles.pillOutlineNavy}`} href={sectionHref("project-inquiry")} onClick={followInquiryLink}>
            <span>Open a Guild inquiry</span>
            <i className={styles.pillIcon}><b className={styles.iconLogo} /></i>
          </a>
        </div>
      </div>
      <div className={styles.practiceCards}>
        {activeSpears.map((item) => (
          <article className={styles.practiceCard} key={item.index}>
            <Image src={item.art} alt={item.artAlt} width={1024} height={768} />
            <div>
              <p className={styles.disciplineTag}>{item.tag}</p>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <a href={item.href} target="_blank" rel="noopener noreferrer">{item.cta} <span>↗</span></a>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.practiceGeneral}>Not sure which practice fits? <a href={sectionHref("project-inquiry")} onClick={followInquiryLink}>Open the Guild inquiry form →</a></p>
    </section>
  );
}
