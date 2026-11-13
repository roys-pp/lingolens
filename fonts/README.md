# Bundled fonts

The canvas text in the cockpit (labels, captions, end card, drawings, keypad digits) uses these fonts. Quest Browser has none of the Mac fonts the build used to name first ("Helvetica Neue", "Marker Felt"), so the text a judge reads now matches the screenshots.

| File | Source | Changes | Licence |
|---|---|---|---|
| `lastochka-sans.woff2` | Noto Sans, variable (google/fonts `ofl/notosans`) | Width fixed at 100, weight limited to 500–700, subset | `OFL-NotoSans.txt` |
| `lastochka-narrow.woff2` | Noto Sans, the same file | A static instance at width 87.5 (SemiCondensed) and weight 700, subset | `OFL-NotoSans.txt` |
| `lastochka-hand.woff2` | Pangolin Regular (google/fonts `ofl/pangolin`) | Subset; 2026-11-12: a GPOS `mark` lookup for the stress mark (below) | `OFL-Pangolin.txt` |
| `PT_Serif-Web-Regular.ttf`, `PT_Serif-Web-Bold.ttf` | PT Serif (google/fonts `ofl/ptserif`, 2026-11-12) | None: the files as published | `OFL-PTSerif.txt` |
| `PT_Sans-Web-Regular.ttf`, `PT_Sans-Web-Bold.ttf` | PT Sans (google/fonts `ofl/ptsans`, 2026-11-12) | None: the files as published | `OFL-PTSans.txt` |

- **Subset (the Lastochka files):** Basic Latin, Latin-1, the combining grave and acute accents (U+0300, U+0301, the stress mark), the combining breve and diaeresis, Cyrillic U+0400–045F, general punctuation, №, arrows and minus. The layout features are kept.
- **Tools:** fontTools 4.55 (`varLib.instancer`, then `subset --flavor=woff2 --no-hinting --layout-features='*'`).
- **Rejected:**
  - Caveat and Neucha both misplace the stress mark after a lowercase vowel (Neucha has no U+0301 at all).
  - PT Sans as a subset: it carries Reserved Font Names, so a subset would need a new name. The courtyard (below) bundles the unmodified files instead.

Neither the Noto nor the Pangolin licence reserves a font name, so those modified files may keep their internal names. The CSS family names (`Lastochka Sans`, `Lastochka Narrow`, `Lastochka Hand`) are set in `src/engine/fonts/fonts.ts`.

## The stress mark (U+0301), measured 2026-11-12

Measured in headless Chrome (the ink of a word with the mark minus the ink without it, at 200 px; `.tmp/lingolens/look/magic-ui/stress_native.json` and `stress_crayon_fixed.json`). The centre of a well-placed mark sits 50% across its vowel.

- **Pangolin, as subset before:** 87 to 94% across (over the right stem), and after a capital the mark overlapped the letter by 13 to 19 px. Its GPOS had only `kern`, so the mark's own outline (no advance, drawn back over the letter before it) placed it; nothing seated it. (This file used to say `mark` and `ccmp` seated it; they did not.)
- **Pangolin, fixed:** a GPOS mark-to-base lookup (`mark` feature, every script) anchors the acute over the 18 Cyrillic vowels, lowercase and capital: horizontally at the vowel's ink centre, vertically at the face's own lowercase gap above the vowel's ink top (77 units), so a capital lifts it clear. Anchors from the original Pangolin outlines. Result: 49 to 50% across every vowel, 15 to 16 px clear. The repack (`.tmp/lingolens/look/magic-ui/tools/woff2_repack.mjs`, `add_mark_gpos.py`) replaced only the GPOS table: glyf, loca and every other table are byte for byte the old ones, checked on write. Lastochka's crayon text («Ла́сточка» on its start page) gains the same centred stress.
- **PT Serif and PT Sans:** no `mark` feature either (GPOS has `case`, `cpsp`, `kern`): 59 to 75% across a lowercase vowel, and after a capital the mark falls on the next letter. They stay unmodified (reserved names), so the courtyard's canvases set the stress by hand: `src/game/city/world/render/type.ts` `drawStressed()` draws the word without the combining mark and a spacing acute over the vowel's ink centre.

## The courtyard's faces (Level 1, `?level=city`)

`src/game/city/world/render/type.ts` adds the four PT files with FontFace as "Courtyard Serif" and "Courtyard Sans" (never the reserved names) when the courtyard is built, and the cards draw no text until they have loaded or been given up on (6 s), then repaint if they arrive late. Fallbacks: Noto Serif or Noto Sans, which Quest Browser has. Size: 1.6 MB for the four files (uncompressed TTF; a host that gzips fonts sends about half).
