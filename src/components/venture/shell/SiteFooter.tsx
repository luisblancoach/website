"use client";

import Link from "next/link";
import Sigil from "../primitives/Sigil";
import { CopyText } from "../primitives/Review";
import { useVenture } from "./VentureShell";
import type { FooterIcon } from "@/lib/narrative/site";
import styles from "../venture.module.css";

// November 10 (owner): each link shows its mark (CSS masks in currentColor, like
// the pill icons). The two hunt clues that sat above the copyright on the
// audience routes ("A signal at the edge of the map", "A mark left by the
// walker") were removed at the owner's request.
const ICONS: Record<FooterIcon, string> = {
  github: styles.iconGithub,
  x: styles.iconX,
  discord: styles.iconDiscord,
  brand: styles.iconLogo,
  blog: styles.iconBlog,
};

export default function SiteFooter() {
  const { pathname, site } = useVenture();
  const { motto, socials, copyright } = site.footer;

  return (
    <footer className={styles.footer}>
      {pathname === "/"
        ? <a className={styles.brand} href="#top"><Sigil /><span>RAID{" "}<br />GUILD</span></a>
        : <Link className={styles.brand} href="/"><Sigil /><span>RAID{" "}<br />GUILD</span></Link>}
      <p><CopyText copy={motto.lead} />{" "}<br /><CopyText copy={motto.em} /></p>
      <div className={styles.socials}>
        {socials.map((link) => (
          <a key={link.label.id} href={link.href} target="_blank" rel="noopener noreferrer">
            <span className={`${styles.socialIcon} ${ICONS[link.icon]}`} aria-hidden="true" />
            <CopyText copy={link.label} />
          </a>
        ))}
      </div>
      <small><CopyText copy={copyright} /></small>
    </footer>
  );
}
