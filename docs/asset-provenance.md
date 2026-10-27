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
| `Ilus_03.png` (1536 × 2048) | Foundry turning raw material into output | `2083c2a91de9d11c72d7c1e7202c8296` | `public/images/illustrations/Ilus_03.png`: Services & Capabilities, both routes |
| `ilus_horiz_001.png` (1024 × 768) | Builder keeping a signal tower and servers | `e6cf33d9b10968eeb5469c501965d15a` | `public/images/illustrations/ilus_horiz_001.png`: Stewardship heading, `/community` |
| `ilus_horiz_002.png` (1024 × 768) | Foundry turning raw material into output | `945d53551e8a68c98bfa4414b012a100` | No |
| `ilus_horiz_003.png` (1024 × 768) | Crew repairing a vessel | `a4876a7ce5a74c6487ed7b2dff0b9251` | `public/images/illustrations/ilus_horiz_003.png`: Builder Network heading, `/clients` |

Placements are declared in `src/lib/data/illustrations.ts`. The illustrations are
decorative (empty alt text), keep their transparency and native aspect ratio, and are
never displayed larger than their source size.
