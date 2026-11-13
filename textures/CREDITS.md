# Cockpit textures: sources and licences

Every file here is derived from a **CC0 1.0 (public domain)** source and was cropped, resized and converted by `lingolens/10-build/tools/prep_art_textures.py` (2026-11-04). CC0 needs no attribution; we list the sources anyway so anyone can check them. Nothing here is third-party material under any other licence. All other cockpit surfaces are painted in code (`src/scene/cockpit/art.ts`, `textures.ts`).

| File | Made from | Source | Licence |
|---|---|---|---|
| `console_rgh.webp` | "Blue Metal Plate" by Rob Tuytel, roughness map (1k). Cropped between its welded strips and high-passed to keep only the scratches. | https://polyhaven.com/a/blue_metal_plate | CC0 1.0 (https://polyhaven.com/license) |
| `console_detail.webp` | The same asset's diffuse map (1k): grey, high-passed scratches and smudges | https://polyhaven.com/a/blue_metal_plate | CC0 1.0 |
| `knit_nrm.webp` | "Knitted Fleece", normal map, OpenGL (1k) | https://polyhaven.com/a/knitted_fleece | CC0 1.0 |
| `knit_col.webp` | "Knitted Fleece", diffuse map (1k) as a light grey the yarn colour multiplies | https://polyhaven.com/a/knitted_fleece | CC0 1.0 |
| `paper_nrm.webp` | "Paper 003", normal map, OpenGL (1K-JPG) | https://ambientcg.com/view?id=Paper003 | CC0 1.0 (https://docs.ambientcg.com/license/) |

To rebuild the set, download the originals into a new, empty folder and run `python3 prep_art_textures.py <folder>`.

The folder needs:
- `blue_metal_plate_{diff,rough}_1k.jpg` and `knitted_fleece_{diff,nor_gl}_1k.jpg` from the Poly Haven pages above;
- `p3/Paper003_1K-JPG_NormalGL.jpg`, from the ambientCG 1K-JPG zip unpacked into `p3/`.
