# GauRush website maintenance
Live website: https://t28tqs.github.io/GauRush/
GitHub Pages publishes the main branch at the repository root.
## Current source
- index.html: page structure, product copy, installer URL and verification details.
- retro.css: layout, colors, responsive styling.
- retro.js: workflow video tabs, menu, scroll reveals and interactive particle studies.
- scene.css: optimized generated cinematic background, embedded for a self-contained asset.
- fonts.css: self-hosted font data. Licenses are in FONT-LICENSES.txt.
- assets/: original app logo and demo recordings.
- DESIGN.md and .impeccable/design.json: implemented design system.
The old site.css and site.js remain unused for historical continuity. The redesigned page loads retro.css and retro.js.
## Updating releases
Update the final download link, version, size and SHA-256 in index.html. Also update the header version and tool inventory version. Keep the header and hero free of download buttons.
## Verification
Check mobile and desktop layout, keyboard navigation, all four video tabs, final installer link, checksum, and reduced-motion behavior. No build command is required for this static site.

## Y2K chrome refinement
chrome.css loads after retro.css and contains the self-hosted Orbitron display face, reflective title treatment, chamfered frames and metallic controls. Edit this layer for the current title and frame styling.

## Supplied UI kit
kit-assets.css embeds the supplied PNG artwork and cursor images. kit.css loads after it and contains readable placement and cursor styles. kit.js connects the tool artwork links to demo tabs and the export description. Original PNGs are retained in the local website/published/assets/kit-*.png files. Pointer artwork is enabled for fine-pointer hover devices, with native text, video and viewport-drag cursors retained.
