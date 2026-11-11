"use client";

import Link from "next/link";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import Sigil from "../primitives/Sigil";
import { useVenture } from "./VentureShell";
import styles from "../venture.module.css";

export default function SiteFooter() {
  const { pathname } = useVenture();

  return (
    <footer className={styles.footer}>
      {pathname === "/"
        ? <a className={styles.brand} href="#top"><Sigil /><span>RAID<br />GUILD</span></a>
        : <Link className={styles.brand} href="/"><Sigil /><span>RAID<br />GUILD</span></Link>}
      <p>INDEPENDENT MINDS.<br />WE GO FURTHER TOGETHER.</p>
      <div className={styles.socials}>
        <a href="https://github.com/raid-guild" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <a href="https://x.com/RaidGuild" target="_blank" rel="noopener noreferrer">X / TWITTER</a>
        <a href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">DISCORD</a>
        <a href="https://raidguild-brand-guide-production.up.railway.app/" target="_blank" rel="noopener noreferrer">BRAND ARCHIVE</a>
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
      <small>© 2019—2026 RAIDGUILD · EARTH &amp; ELSEWHERE</small>
    </footer>
  );
}
