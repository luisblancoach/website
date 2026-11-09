"use client";

import Link from "next/link";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import Sigil from "../primitives/Sigil";
import { CopyText } from "../primitives/Review";
import { useVenture } from "./VentureShell";
import styles from "../venture.module.css";

export default function SiteFooter() {
  const { pathname, site } = useVenture();
  const { motto, socials, copyright } = site.footer;

  return (
    <footer className={styles.footer}>
      {pathname === "/"
        ? <a className={styles.brand} href="#top"><Sigil /><span>RAID<br />GUILD</span></a>
        : <Link className={styles.brand} href="/"><Sigil /><span>RAID<br />GUILD</span></Link>}
      <p><CopyText copy={motto.lead} /><br /><CopyText copy={motto.em} /></p>
      <div className={styles.socials}>
        {socials.map((link) => <a key={link.label.id} href={link.href} target="_blank" rel="noopener noreferrer"><CopyText copy={link.label} /></a>)}
      </div>
      {/* Audience routes (October 30, late night): the hunt's second and final
          clues live here, away from the inquiry form and the creed's call to
          action ("/" keeps them beside its inquiry and creed). */}
      {pathname !== "/" && (
        <div className={styles.footerClues}>
          <div className={styles.unchartedWalker}><HuntPixel artifact="signal" /><HuntMarker artifact="signal" label="A signal at the edge of the map" /></div>
          <div className={styles.unchartedWalker}><HuntPixel artifact="walker" /><HuntMarker artifact="walker" label="A mark left by the walker" /></div>
        </div>
      )}
      <small><CopyText copy={copyright} /></small>
    </footer>
  );
}
