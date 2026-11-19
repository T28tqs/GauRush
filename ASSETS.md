# Asset provenance

- assets/icon.svg: existing GauRush app identity, reused unchanged.
- assets/{view,crop,lasso,animate}.{jpg,webm}: pre-existing GauRush recordings with a synthetic splat capture.
- assets/scene.jpg and scene.css: original artwork generated with the built-in image_gen tool on 2026-11-20. Source PNG retained in the Codex generated_images folder. Exact prompt: assets/scene.prompt.txt. JPEG optimization uses quality 85; no scene-content editing.
- fonts.css embeds Space Grotesk and IBM Plex Mono, self-hosted under the licenses in FONT-LICENSES.txt. No third-party runtime font request.
- Canvas studies are mathematically generated torus, radial-profile and dust geometry, labeled illustrative.

- chrome.css embeds the open-license Orbitron variable font for the Y2K refinement. Source: https://github.com/google/fonts/tree/main/ofl/orbitron . License: assets/Orbitron-OFL.txt. Chrome text and beveled panel frames are native CSS, adapted from the user-provided UI-kit direction.

## Supplied UI-kit artwork
The user supplied separated transparent PNG files in Downloads/gaurush web elements. Ten decorations are reused unchanged in kit-assets.css: brandplate, PLY/SOG format badges, ribbon, orbit, star, barcode and Editor/Timeline/Export artwork. Original source PNGs are retained in the local website/published/assets/kit-*.png files. White and orange cursor PNGs are derived from supplied Layer-26 and Layer-25, resized proportionally to 40×47 with transparency preserved. No artwork content was generated or redrawn. Non-product identifiers in the barcode and orbital artwork are decorative and hidden from assistive technology.
