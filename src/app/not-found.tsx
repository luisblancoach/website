import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

// Any route that does not exist (November 11). Next.js answers with HTTP 404
// and adds noindex. The fallen signpost: public/images/venture/states/404.png
// (docs/asset-provenance.md). The page copy ("This trail ends here.", "Back to
// RaidGuild") is new and pending Tae's review.
export const metadata: Metadata = {
  title: "This trail ends here",
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Image
          className={styles.art}
          src="/images/venture/states/404.png"
          alt=""
          width={1448}
          height={1086}
          sizes="(max-width: 700px) 80vw, 460px"
          priority
        />
        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>This trail ends here.</h1>
          <Link className={styles.back} href="/">Back to RaidGuild</Link>
        </div>
      </div>
    </main>
  );
}
