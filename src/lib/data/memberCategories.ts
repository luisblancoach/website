import type { Mercenary } from "./members";
export const memberCategories = ["All builders", "Frontend", "Smart Contracts", "UX/UI", "Fullstack", "Coordination"] as const;
export type MemberCategory = typeof memberCategories[number];
export function filterMembers(members: Mercenary[], category: MemberCategory): Mercenary[] {
  if (category === "All builders") return members;
  if (category === "UX/UI") return members.filter(member => /[Uu][Ii].*[Uu][Xx]|[Uu][Xx].*[Uu][Ii]/.test(member.title));
  if (category === "Coordination") return members.filter(member => !/Frontend|Smart Contracts|Design|Fullstack/i.test(member.title));
  return members.filter(member => member.title === category);
}
