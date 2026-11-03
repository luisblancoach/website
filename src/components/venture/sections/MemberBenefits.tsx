import Image from "next/image";
import type { FeatureGalleryContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import gallery from "../gallery.module.css";
import styles from "../benefits.module.css";

// Member benefits on /community (November 3): why a builder would join, kept
// apart from the capability gallery. Same surface, heading and card language
// as the galleries (gallery.module.css), its own compact layout
// (benefits.module.css): no scrolling row, no large artwork; four numbered
// cards with a small square of art, two per row from 700 px and a plain
// stack on phones. Nothing in a card is interactive; the art is decorative.
export default function MemberBenefits({ id, content }: { id: string; content: FeatureGalleryContent }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className={`${gallery.gallery} ${gallery.benefits}`} aria-labelledby={titleId}>
      <div className={`${gallery.head} ${styles.head}`}>
        <div>
          <p className={gallery.label}><CopyText copy={content.label} /></p>
          <h2 id={titleId} className={gallery.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        </div>
        {content.intro && <p className={`${gallery.intro} ${styles.intro}`}><CopyText copy={content.intro} /></p>}
      </div>
      <ol className={styles.grid}>
        {content.cards.map((card, index) => (
          <li key={card.title.lead.id} className={styles.item}>
            <article className={styles.card} aria-labelledby={`${id}-card-${index}`}>
              <div className={styles.thumb}>
                <Image src={card.image.src} alt="" width={card.image.width} height={card.image.height} sizes="(max-width: 999px) 56px, 104px" />
              </div>
              <p className={styles.meta}>
                <span className={styles.cardLabel}><CopyText copy={card.label} /></span>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </p>
              <h3 id={`${id}-card-${index}`} className={styles.cardTitle}><span><CopyText copy={card.title.lead} /></span><br /><em><CopyText copy={card.title.em} /></em></h3>
              <p className={styles.body}><CopyText copy={card.body} /></p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
