import styles from "../venture.module.css";

const variants = {
  communityField: styles.slopeCommunityField,
  fieldPractice: styles.slopeFieldPractice,
  practiceContact: styles.slopePracticeContact,
} as const;

// Angled transition between two section backgrounds.
export default function SectionSlope({ variant }: { variant: keyof typeof variants }) {
  return <div className={`${styles.sectionSlope} ${variants[variant]}`} aria-hidden="true" />;
}
