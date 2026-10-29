import type { Mercenary } from "./members";
export const memberCategories = ["All builders", "Frontend", "Smart Contracts", "UX/UI", "Fullstack", "Coordination"] as const;
export type MemberCategory = typeof memberCategories[number];
export function filterMembers(members: Mercenary[], category: MemberCategory): Mercenary[] {
  if (category === "All builders") return members;
  if (category === "UX/UI") return members.filter(member => /[Uu][Ii].*[Uu][Xx]|[Uu][Xx].*[Uu][Ii]/.test(member.title));
  if (category === "Coordination") return members.filter(member => !/Frontend|Smart Contracts|Design|Fullstack/i.test(member.title));
  return members.filter(member => member.title === category);
}

// Masonry rows for the builder wall: each member joins the row with the least
// estimated length, so rows stay close in length while every card keeps the
// width of its own name and title. Every member appears exactly once.
export function masonryRows(members: Mercenary[], rows = 3): Mercenary[][] {
  const result: Mercenary[][] = Array.from({ length: rows }, () => []);
  const lengths = new Array(rows).fill(0);
  for (const member of members) {
    const row = lengths.indexOf(Math.min(...lengths));
    result[row].push(member);
    lengths[row] += Math.max(member.name.length * 1.6, member.title.length) + 12;
  }
  return result.filter((row) => row.length > 0);
}
