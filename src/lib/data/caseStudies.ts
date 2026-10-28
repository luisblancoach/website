// Client showcase projects, in marquee order. Supplied by the project owner on
// October 27, 2026 (casestudies/clients.pdf, custom_buttons/, snapshots/): each
// project has its custom logo button, a screenshot of its own website, and its
// official site. Descriptions of RaidGuild's work are not stored here; they
// live in the narrative layer with their review status (lib/narrative/clients.ts).
// Links follow clients.pdf, except Daedalus, which keeps the existing ddls.co.
export type CaseStudyProject = {
  id: string;
  name: string;
  href: string;
  button: string;
  snapshot: string;
};

export const caseStudyButtonSize = { width: 228, height: 88 };
export const caseStudySnapshotSize = { width: 1692, height: 908 };

const project = (id: string, name: string, href: string): CaseStudyProject => ({
  id,
  name,
  href,
  button: `/images/casestudies/custom_buttons/button_${id}.svg`,
  snapshot: `/images/casestudies/snapshots/Snapshot_${id}.png`,
});

export const caseStudyProjects: CaseStudyProject[] = [
  project("daohaus", "DAOhaus", "https://daohaus.org/"),
  project("daedalus", "Daedalus", "https://ddls.co/"),
  project("brightid", "BrightID", "https://www.brightid.org/"),
  project("livepeer", "Livepeer", "https://livepeer.org"),
  project("hypercerts", "Hypercerts", "https://hypercerts.org/"),
  project("pocket", "Pocket Network", "https://pocket.network"),
  project("problem", "Problem", "https://www.problem.tv"),
  project("gitcoin", "Gitcoin", "https://gitcoin.co/"),
  project("yieldnest", "YieldNest", "https://yieldnest.finance/"),
];
