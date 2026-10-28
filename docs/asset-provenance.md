# Asset provenance

Recorded 2026-10-27. Covers the artwork added during the Venture Beyond integration
(audience routes `/clients` and `/community`).

**Provenance:** AI-generated for RaidGuild. **Approval:** approved for public use in
this project by the project owner. No third-party licence and no exclusive copyright
ownership is claimed for these files.

## Queen Raida

| File in the repository | Source | Details |
|---|---|---|
| `public/images/queen-raida/queen-raida-v2.png` | `raid-guild/website` working copy, `public/images/queen-raida/queen-raida-reference.png`, modified 2026-10-26 23:56 | 1672 × 941 PNG, no transparency, MD5 `b533c6119cb4f3e73cbc80868d47e8c1`. Used by the Queen Raida module on `/community`. |

The previous reference image (1632 × 818) is superseded, is not referenced by the site
and is not part of the repository.

## Illustration library (`imaginery`)

All six files were approved together: three scenes, each in a portrait and a horizontal
cut. Each scene is used once, in the cut that suits its layout; the other three cuts
remain approved and unused; they stay unmodified in the source library (`~/Desktop/RG/imaginery`) rather than in the repository.

| File | Scene | MD5 | Used in the repository |
|---|---|---|---|
| `Ilus_01.png` (1536 × 2048) | Builder keeping a signal tower and servers | `087e7edad3052ebe2582d1d49366e4ca` | No |
| `Ilus_02.png` (1536 × 2048) | Crew repairing a vessel | `9a9702f56c209636500d95386a432456` | No |
| `Ilus_03.png` (1536 × 2048) | Foundry turning raw material into output | `2083c2a91de9d11c72d7c1e7202c8296` | `public/images/illustrations/Ilus_03.png`: Services & Capabilities, both routes (desktop on `/clients`) |
| `ilus_horiz_001.png` (1024 × 768) | Builder keeping a signal tower and servers | `e6cf33d9b10968eeb5469c501965d15a` | `public/images/illustrations/ilus_horiz_001.png`: Stewardship heading, `/community` |
| `ilus_horiz_002.png` (1024 × 768) | Foundry turning raw material into output | `945d53551e8a68c98bfa4414b012a100` | `public/images/illustrations/ilus_horiz_002.png`: Services, `/clients` mobile (from 2026-10-28) |
| `ilus_horiz_003.png` (1024 × 768) | Crew repairing a vessel | `a4876a7ce5a74c6487ed7b2dff0b9251` | `public/images/illustrations/ilus_horiz_003.png`: Builder Network heading, `/clients` |

**Exception, approved 2026-10-28:** the foundry scene is used in both cuts. The October 27
Hire the DAO designs place the portrait cut (`Ilus_03.png`) beside the `/clients` Services
accordion on desktop and the horizontal cut (`ilus_horiz_002.png`) above it on mobile. The
file was copied unmodified from the source library; its MD5 matches the table. Every
other scene is still used once.

Placements are declared in `src/lib/data/illustrations.ts`. The illustrations are
decorative (empty alt text), keep their transparency and native aspect ratio, and are
never displayed larger than their source size.

## Client showcase (`casestudies`)

Recorded 2026-10-28. Supplied by the project owner on 2026-10-27 in `~/Desktop/RG/casestudies`
for the `/clients` "What we've built for our clients" showcase; the copy in
`public/images/casestudies/` is byte-identical. Unlike the artwork above, these are not
AI-generated: the buttons carry third-party project logos (trademarks of their owners) and
the snapshots are screenshots of each project's own website homepage. They are used to
identify the projects only, as supplied and unmodified. No licence to the logos is claimed.

| Project | Button (`custom_buttons/`, 228 × 88 SVG, paths only) | Snapshot (`snapshots/`, 1692 × 908 PNG) |
|---|---|---|
| DAOhaus | `button_daohaus.svg` `0e64ced09438fcc01e1172be91448d07` | `Snapshot_daohaus.png` `cbc154d991d64bc98e213798e1e4e4fc` |
| Daedalus | `button_daedalus.svg` `f806ac6564142cc902f93270ddcdc80b` | `Snapshot_daedalus.png` `80c49f726eac2fac099a059da0c6737c` |
| BrightID | `button_brightid.svg` `36f28174708b65a5e56167c85e283087` | `Snapshot_brightid.png` `70a25cb9a89c2cfbf72229bc1cada820` |
| Livepeer | `button_livepeer.svg` `9cfbae60b6e795ee2a13759d296df1cb` | `Snapshot_livepeer.png` `593a8c3936693a49d00b27b56d69acb8` |
| Hypercerts | `button_hypercerts.svg` `a244cf07d691934850f35e26bd2eb041` | `Snapshot_hypercerts.png` `3a1fff5b023cc4fe9f9879ef9a8a4be5` |
| Pocket Network | `button_pocket.svg` `9b5c1d8520c77b3eda48c5d5b0d07e31` | `Snapshot_pocket.png` `984462b603f44935b6986777c9315427` |
| Problem | `button_problem.svg` `d0faaaa9fc3d6c92ffea6379a35f7ad7` | `Snapshot_problem.png` `dd8f2c8a61372a1ccffa595fe7daac4a` |
| Gitcoin | `button_gitcoin.svg` `81e68e92ac6f9a98c4a768abfd5236aa` | `Snapshot_gitcoin.png` `fa3934c8f93c1e2f41a44a7f4c369268` |
| YieldNest | `button_yieldnest.svg` `66095bf588e8665df946e5bf1764e194` | `Snapshot_yieldnest.png` `50c4bb8d7c25cadffb89429362a91e40` |

MD5 values follow each file name. `clients.pdf` (the source sheet: buttons, bare logos and
links) is a reference document only and is not part of the repository. Placements are
declared in `src/lib/data/caseStudies.ts`.

`public/images/queen-raida/queen_raida_reference_vertical.png` (1024 × 1536, MD5
`11d2e4a202d17fb6ab20ed85545f994b`) is present in the working tree for the `/community`
Queen Raida module. It is not referenced by the site and not yet recorded as shipped.
