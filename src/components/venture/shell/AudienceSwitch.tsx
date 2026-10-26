"use client";

import Link from "next/link";
import { AUDIENCES, type AudienceId } from "@/lib/venture-routes";
import styles from "../venture.module.css";

// Navigates between the audience narratives (October 23 placement: a pill
// pinned to the top of the viewport). Appearance stays with ThemeSwitch, and
// nothing about the audience is stored.
export default function AudienceSwitch({ current, onNavigate }: { current: AudienceId; onNavigate?: () => void }) {
  return (
    <div className={styles.audienceSwitch} role="group" aria-label="Choose your RaidGuild experience">
      {AUDIENCES.map((audience) => (
        <Link
          key={audience.id}
          href={audience.href}
          aria-current={audience.id === current ? "page" : undefined}
          onClick={onNavigate}
        >
          {audience.label}
        </Link>
      ))}
    </div>
  );
}
