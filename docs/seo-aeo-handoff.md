# SEO / AEO handoff — Venture Beyond (2026-11-10)

Scope: `/`, `/agency` (Hire the DAO), `/community` (Join the DAO) in the final handoff candidate (16 illustrations,
UI polish, this pass). References: Google Search Central (titles, snippets, canonicalization, robots meta,
sitemaps, structured data general guidelines, Organization logo) and Bing Webmaster Guidelines. Earlier analysis:
`~/Projects/raidguild-backups/2026-11-06/raidguild-seo-aeo-audit-response.md` (items B-1…B-6, C-4, C-5, D-1…D-7).
Status: implemented and verified locally; **not committed, not deployed**.

## 1. Existing implementation and findings

| Area | Before this pass | Finding |
|---|---|---|
| Titles, descriptions | Unique per route; OG and Twitter cards on all three | Good base. `/` title is brand + tagline only; `/community` title "Join the DAO" is vague; `/agency` description is 177 chars and says "Pokt Network" (the site says "Pocket Network") |
| Canonical | `https://www.raidguild.org` + path (root `metadataBase`) | Correct target domain, but the redesign is not live there yet (D-2) |
| Indexing | `/agency`, `/community` hard-coded `noindex, follow`; **`/` indexable on every host** | The Vercel review alias and Railway could compete with raidguild.org |
| Sitemap | `/` only | Missing the two audience routes |
| robots.txt | Allow all, named AI crawlers, `Content-Signal: search=yes, ai-input=yes, ai-train=no`, Sitemap line | Fine. `Host:` is non-standard (ignored by Google/Bing), harmless |
| JSON-LD | Organization on `/` only (logo, founding 2019, GitHub/X/Discord) | Nothing on the audience routes; Discord invite is not an identity profile |
| Share images | Absolute `www.raidguild.org/...` | Broken previews on every review host (B-1) |
| Headings | One H1 per route, sensible H2/H3 outline | Two-line headings had no space in the HTML text ("Builder-ownedmember-governed", "Questionsbefore we build"): text extractors glued words (B-2) |
| Alt text | Meaningful images described; card art `alt=""` | Card illustrations are decorative next to their titles (see §6) |
| Rendered HTML | `/agency`, `/community` prerendered static, `/` server-rendered; 4.5–7.2k chars of text without JS | Good: content is crawlable without JavaScript |
| llms.txt | Home anchors, Portal, handbook, practices | Did not mention `/agency` or `/community` |
| Agent Markdown | `Accept: text/markdown` on `/` returned old-site copy ("#hire-us", "free four-week proving ground"); `/join` entry unreachable | Different and unverified content served only to agents |
| Mobile | `width=device-width` viewport, `lang="en"`, no horizontal overflow (checked 393 px) | Fine. Core Web Vitals not measured (no Lighthouse run) |

## 2. Issues fixed (this pass)

- **Indexing gate** (`src/lib/seo.ts`): every build is `noindex, follow` unless it is the canonical production
  deployment — a Vercel production build whose production domain is `www.raidguild.org`/`raidguild.org`, or any
  host built with `RAIDGUILD_INDEXING=on`. Set once in the root layout; the pages no longer hard-code robots.
  The Cloudflare review Worker additionally sends `X-Robots-Tag: noindex, nofollow` (unchanged).
- **Canonical and og:url** are absolute on `https://www.raidguild.org` for all three routes.
- **Share images** resolve on the deployment's production host (`metadataBase` = Vercel's production domain, or
  Railway's). On raidguild.org this is the site itself. Correction after the release (2026-11-10): the Vercel review
  project's production domain is `raidguild.estudioblanco.org`, which still redirects to Railway, so previews from the
  review site show no image; on Cloudflare (no origin variable) they point at raidguild.org paths that exist only
  after go-live. Review hosts only; no effect on raidguild.org.
- **`twitter:site` = `@RaidGuild`** on all three routes.
- **Sitemap**: `/`, `/agency`, `/community` on the canonical origin, and empty while the build is not indexable.
- **JSON-LD** on all three routes (§4).
- **Heading text**: a real space before every `<br>` in the venture components (30 places). Layout verified
  identical (every element's box, 3 routes × Day/Night × 1440/393).
- **llms.txt**: adds Hire the DAO and Join the DAO, described with published wording.
- **Agent Markdown**: the stale `/` and the unreachable `/join` variants were removed; agents get the same HTML
  as people. `/witch` keeps its description.

## 3. Recommended title and description per route (proposals for Tae / the owner; not applied)

| Route | Current | Proposed |
|---|---|---|
| `/` title | RaidGuild — Venture Beyond (26) | RaidGuild \| Builder-Owned Community for Onchain, AI and Open Source (67) |
| `/` description | Meet RaidGuild, a builder-owned community of designers, engineers, researchers, strategists, and operators… (182) | RaidGuild is a builder-owned community of designers and engineers working across onchain systems, applied AI, and open source. Hire the DAO or join it. (151) |
| `/agency` title | RaidGuild \| Smart Contracts, dApp & AI Development Studio (57) | Keep |
| `/agency` description | Small senior teams for smart contracts, dApps, product design and applied AI. We've shipped work for Livepeer, Pokt Network, DAOHaus, Gitcoin and more. Start your project brief. (177) | Senior designers and engineers for smart contracts, dApps, product design and applied AI. Work for Livepeer, Pocket Network, DAOhaus, Gitcoin and more. (151) |
| `/community` title | Join the DAO \| RaidGuild (24) | Join RaidGuild \| A Builder-Owned DAO for Onchain and AI Builders (64) |
| `/community` description | RaidGuild is a builder-owned community. Meet Guild members, explore their experiments, and find people to build and contribute with. (132) | Keep, or: RaidGuild is a builder-owned DAO. Meet members, see how raids work, and start your path to membership on Portal. (112) |

`/agency` and `/community` meta are editable in Editorial Mode (`clients.meta.*`, `community.meta.*`); `/` meta is
in `src/app/(venture)/page.tsx` (owner).

## 4. JSON-LD implemented (`src/lib/seo.ts`, one `@graph` per route)

- **Organization** (`https://www.raidguild.org/#organization`): name, url, logo
  (`/images/raidguild-logo.svg`), the site's existing description, `foundingDate` 2019 ("since 2019" is published),
  `sameAs` GitHub and X (the footer's profiles). No ratings, reviews, prices, addresses or people.
- **WebSite** (`/#website`): name, url, `inLanguage`, publisher → Organization. No SearchAction (the site has no search).
- **WebPage** per route: url = canonical, name = page title, description = meta description, `isPartOf` WebSite,
  `about` Organization.
- **Service** ×6 on `/agency`: name and description are the services gallery cards exactly as shown; provider →
  Organization. A test keeps them equal to the visible text.
- **Not added:** BreadcrumbList (no visible breadcrumb; the routes are one level deep), FAQPage (Google shows FAQ
  rich results only for authoritative government and health sites since 2023; the FAQ text is already crawlable),
  Offer/price (no published prices), Person, Review.

Validation: JSON parses on all three routes; every `@id` reference resolves; required properties present;
WebPage url/name/description equal the page's canonical, title and meta description. Run Google's Rich Results Test
and the Schema Markup Validator on the public URLs after go-live (review hosts are noindex or login-protected).

## 5. Indexing and canonical domain strategy

- **Canonical origin:** `https://www.raidguild.org` (RaidGuild's existing public domain). **Decision required
  (D-2):** confirm `www` vs the apex, that the redesign replaces the current site there, and redirect the other
  form with a 301.
- **Go-live switch:** indexing turns on automatically for a Vercel production deployment whose production domain
  is `www.raidguild.org`/`raidguild.org`; on any other host set `RAIDGUILD_INDEXING=on` for the production build.
  **If raidguild.org is served by anything else and the variable is not set, the site stays `noindex`** — check
  `<meta name="robots">` right after launch.
- **Review hosts** (Vercel `raidguild-venture-beyond-review`, Railway, the Cloudflare Worker,
  `raidguild.estudioblanco.org`): `noindex`, canonical to raidguild.org, empty sitemap. They never compete.
- **Redirects:** `/clients/*` → `/agency/*` (308), `/join` → Portal (308), legacy `?audience=` links (307). Minor:
  `/clients/` takes two hops (308 → `/clients` → `/agency`).

## 6. Remaining editorial decisions (not applied)

AEO coverage of the questions in the brief, from the visible pages:

| Question | Answer on the site | Status |
|---|---|---|
| What is RaidGuild? | `/` and `/community` heroes ("a builder owned community working across onchain systems, applied AI, and open source software"); `/agency` only implies it | Partial on `/agency`: propose one plain sentence there (e.g. in the services intro or a first FAQ) |
| What does RaidGuild build? / Which services? | "What we can build for you" + six service cards (+ Service JSON-LD) | Answered |
| How does a client start a project? | Inquiry "Tell us what you're building", "Discuss your project", FAQ "What is the process?" | Answered |
| What is membership? | Guild "Builder-owned / member-governed", benefits, kit (voting shares), FAQ | Partial: no one-line definition |
| Who can join? | Not stated | Missing: needs the fact (D-3, membership path) |
| How does someone contribute? | "Ways to contribute" (six cards) | Answered |
| Raids, cohorts, benefits | Raid defined (card 1); cohorts mentioned (benefits, FAQ "first complete a cohort"), not defined; benefits listed | Cohort definition missing |
| How to join the DAO? | Join section, FAQ "How do I become a member?" / "Where do applications happen?", membership guide | Partial: the full path (cohort → champion → proposal vote) awaits D-3 |

Other decisions: the titles and descriptions in §3; brand forms "Pocket Network" (meta still says "Pokt Network")
and "DAOhaus" vs "DAOHaus" (D-7); the `/agency` share-image alt calls Queen Raida "RaidGuild's AI agent" while the
site says "AI CTO"; card illustrations stay decorative (`alt=""`, their titles carry the meaning) unless image search
matters, in which case Tae writes alts; whether to restore a Markdown variant of `/`, written from approved copy;
the process FAQ's "weekly demos" (Reason 6 is retired).

## 7. Test results and limitations

- `bun run test` 130/130 (adds `tests/seo.test.mjs`: canonical origin, noindex by default, empty sitemap, Service
  text = visible text, no invented properties, script-safe JSON); tsc clean; lint 0 errors (1 old warning).
- Isolated production build (`~/Projects/raidguild-backups/2026-11-10/verify-illustrations`): crawl of `/`,
  `/agency`, `/community` without JavaScript (titles, descriptions, canonical, robots, OG/Twitter, JSON-LD,
  headings); robots.txt, sitemap.xml (valid, empty), redirects, Markdown negotiation, share images and logo 200;
  JSON-LD structural check 0 failures; layout identical after the heading change (12 combinations); a second
  build with `RAIDGUILD_INDEXING=on`: `index, follow` on all three and a 3-URL sitemap.
- Earlier suites re-run on this build: UI polish 92/92, hunt 11/11, illustrations 16/16.
- Not done: checks against a public review deployment (nothing deployed in this pass), Lighthouse / Core Web
  Vitals, Google Rich Results Test and Bing validation (need public URLs), comparison with the October 23 reference.

## 8. Post-launch actions

**Google Search Console:** add a Domain property for `raidguild.org` (DNS TXT); confirm `<meta name="robots">` is
`index, follow` and the canonical is self-referencing on `/`, `/agency`, `/community`; submit
`https://www.raidguild.org/sitemap.xml`; URL Inspection → Request indexing for the three URLs; run the Rich Results
Test on each; watch Page indexing ("Alternate page with proper canonical", "Excluded by noindex"), Core Web Vitals
and Enhancements; use `site:` searches for the review hosts and the Removals tool if any appear.

**Bing Webmaster Tools:** import the site from Search Console (or verify by DNS); submit the sitemap; URL Inspection
and Site Scan on the three URLs; optionally enable IndexNow for future updates.

**After launch:** keep `llms.txt` and the Organization `sameAs` in step with the footer; update the Onchain practice
link in `llms.txt` when its canonical subdomain exists; re-run this crawl after any metadata change.
