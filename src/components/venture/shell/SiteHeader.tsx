"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PORTAL_JOIN_URL } from "@/lib/data/constants";
import { audienceForPath, type SectionId } from "@/lib/venture-routes";
import type { NavContent } from "@/lib/narrative/types";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { CopyText } from "../primitives/Review";
import Sigil from "../primitives/Sigil";
import AudienceSwitch from "./AudienceSwitch";
import ThemeSwitch from "./ThemeSwitch";
import { useVenture } from "./VentureShell";
import styles from "../venture.module.css";

type NavItem = { label: string; section: SectionId } | { label: string; inquiry: true };

// Each route links only to sections it carries. The audience routes take their
// navigation from the narrative (the October 23 items), passed in from the
// server so the narrative modules never ship to the browser; "/" keeps its own.
const navItems: Record<string, NavItem[]> = {
  "/": [
    { label: "Guild", section: "guild" },
    { label: "Community stories", section: "work" },
    { label: "Practices", section: "spears" },
  ],
};
export type AudienceNav = Partial<Record<string, NavContent>>;

export default function SiteHeader({ nav = {} }: { nav?: AudienceNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, followSectionLink, followInquiryLink, sectionHref } = useVenture();
  const audience = audienceForPath(pathname);
  const content = nav[pathname];
  const items = navItems[pathname] ?? navItems["/"];
  const joinLabel = "Join through Portal ↗";
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to its toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <header className={audience ? `${styles.header} ${styles.headerWithSwitch}` : styles.header}>
      {audience ? (
        <Link className={styles.brand} href="/" aria-label="RaidGuild home" onClick={() => setMenuOpen(false)}>
          <Sigil />
          <span>RAID<br />GUILD</span>
        </Link>
      ) : (
        <a className={styles.brand} href="#top" aria-label="RaidGuild home">
          <Sigil />
          <span>RAID<br />GUILD</span>
        </a>
      )}

      {audience && <AudienceSwitch current={audience} onNavigate={() => setMenuOpen(false)} />}

      {content ? (
        <nav id="site-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary navigation" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
          {content.items.map((item) => (
            <a key={item.label.id} href={sectionHref(item.section)} onClick={(event) => followSectionLink(event, item.section)}><CopyText copy={item.label} /></a>
          ))}
          <NarrativeAnchor link={content.cta}><CopyText copy={content.cta.label} after={content.cta.href ? " ↗" : ""} /></NarrativeAnchor>
        </nav>
      ) : (
      <nav id="site-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary navigation">
        {items.map((item) => "section" in item ? (
          <a key={item.label} href={sectionHref(item.section)} onClick={(event) => { setMenuOpen(false); followSectionLink(event, item.section); }}>{item.label}</a>
        ) : (
          <a key={item.label} href={sectionHref("project-inquiry")} onClick={(event) => { setMenuOpen(false); followInquiryLink(event); }}>{item.label}</a>
        ))}
        <a href={PORTAL_JOIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{joinLabel}</a>
      </nav>
      )}

      <ThemeSwitch />

      <button
        ref={menuButtonRef}
        className={styles.menuButton}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
