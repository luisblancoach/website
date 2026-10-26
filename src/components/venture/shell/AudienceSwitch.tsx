"use client";

import Link from "next/link";
import { AUDIENCES, type AudienceId } from "@/lib/venture-routes";
import styles from "../venture.module.css";

// Navigates between the audience narratives; appearance is left to ThemeSwitch.
export default function AudienceSwitch({ current, onNavigate }: { current: AudienceId; onNavigate?: () => void }) {
  return (
    <div className={styles.audienceSwitch} role="group" aria-label="Choose a path">
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
