"use client";

import { useEffect, useState } from "react";
import ArtifactGallery from "@/components/ArtifactGallery";
import type { ActivityContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

type Post = { id: string; title: string; description: string; href: string; publishedAt: string };

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Live, dated field notes from Portal followed by the public collection.
// Nothing here is authored by the site: if Portal is unavailable we say so.
function RecentPosts({ content }: { content: ActivityContent }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [state, setState] = useState<"loading" | "live" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/posts", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(({ docs }) => {
        if (!Array.isArray(docs)) throw new Error("Invalid posts");
        setPosts(docs.slice(0, 3));
        setState("live");
      })
      .catch(() => { if (!controller.signal.aborted) setState("error"); });
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.recentPosts} aria-busy={state === "loading"}>
      <h3><CopyText copy={content.postsHeading} /></h3>
      {state === "error" ? (
        <p className={styles.recentPostsEmpty}><CopyText copy={content.postsUnavailable} /></p>
      ) : (
        <ol>
          {(state === "loading" ? [null, null, null] : posts).map((post, index) => post ? (
            <li key={post.id}>
              <a href={post.href} target="_blank" rel="noopener noreferrer">
                <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time>
                <strong>{post.title}</strong>
                {post.description && <span>{post.description}</span>}
              </a>
            </li>
          ) : <li key={index} className={styles.recentPostPlaceholder} aria-hidden="true" />)}
        </ol>
      )}
      <NarrativeAnchor link={content.allPosts} className={styles.handbookLink}><CopyText copy={content.allPosts.label} /></NarrativeAnchor>
    </div>
  );
}

export default function CommunityActivity({ content }: { content: ActivityContent }) {
  const { arrivalTarget, openPortal } = useVenture();
  return (
    <section className={`${styles.fieldNotes} ${styles.activity} ${arrivalTarget === "work" ? styles.sectionArriving : ""}`} id="work" aria-labelledby="activity-heading">
      <header className={styles.narrativeHeading}>
        <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
        <h2 id="activity-heading"><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <p className={styles.narrativeIntro}><CopyText copy={content.intro} /></p>
      </header>
      <RecentPosts content={content} />
      <header className={styles.collectionHeading}>
        <p className={styles.sectionLabel}><CopyText copy={content.collection.label} /></p>
        <h3><CopyText copy={content.collection.title.lead} /><br /><em><CopyText copy={content.collection.title.em} /></em></h3>
      </header>
      <div id="uncharted" className={styles.collectionAnchor}>
        <div id="gallery" className={styles.collectionAnchor}>
          <ArtifactGallery showFeatured={false} onOpenPortal={openPortal} />
        </div>
      </div>
    </section>
  );
}
