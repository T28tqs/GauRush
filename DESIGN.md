---
name: GauRush — Spatial Monitoring Station
description: Cinematic instruments for Gaussian capture editing.
colors:
  void: "#050809"
  panel: "#090e11"
  raised: "#10181b"
  ivory: "#e8e4d9"
  muted: "#a0b5b5"
  cyan: "#75d3df"
  mint: "#b3e0c9"
  amber: "#f4b879"
  magenta: "#8b607d"
  line: "#394447"
  dim-line: "#253135"
typography:
  display:
    fontFamily: '"Space Grotesk",sans-serif'
    fontSize: "clamp(42px,5.15vw,80px)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-.04em"
  headline:
    fontFamily: '"Space Grotesk",sans-serif'
    fontSize: "clamp(34px,4.5vw,66px)"
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: "-.035em"
  body:
    fontFamily: '"IBM Plex Mono",monospace'
    fontSize: "13px"
    lineHeight: 1.8
  label:
    fontFamily: '"IBM Plex Mono",monospace'
    fontSize: "10px"
    letterSpacing: ".055em"
rounded:
  panel: "0px"
  status: "50%"
spacing:
  console-gap: "7px"
  mobile-console-gap: "6px"
  section-gutter: "24px"
  mobile-section-gutter: "14px"
components:
  download-button:
    backgroundColor: "{colors.amber}"
    textColor: "#17130d"
    padding: "15px 18px"
    rounded: "{rounded.panel}"
  feed-tab:
    backgroundColor: "{colors.panel}"
    padding: "0"
    rounded: "{rounded.panel}"
  feed-tab-selected:
    backgroundColor: "#1b1713"
    textColor: "{colors.amber}"
---

# Design System: GauRush

## Overview

**Creative North Star: "The Spatial Monitoring Station"**

The user-confirmed world combines retro-futuristic monitoring instruments with grainy ocean/chrome imagery. Near-black fields, precise cyan/amber/magenta lines, dense asymmetric consoles, and technical typography support the capture-editing workflow. The text-free teal GauRush logo remains the identity anchor.

Artwork and canvas studies supply atmosphere; real application recordings supply product evidence. The timeline is explicitly illustrative. This is an extraction of the implemented code, not a proposed replacement.

**Key Characteristics:**
- Cinematic image depth with thin square instrument frames.
- Large geometric headings and compact monospaced information.
- Asymmetric workstation density.
- Controllable live studies and real recordings.

## Colors

The frontmatter preserves the exact root CSS color tokens. Cyan is the primary instrument accent; amber marks actions, selected feeds, focus, graph traces and keyframes. Muted magenta frames consoles. Mint marks small status points. Void, panel and raised define near-black layers; ivory and muted define text, while line and dim-line divide structure. Raised is declared but currently unused directly.

**The Evidence Rule.** Decorative telemetry must not imply measured application performance.

## Typography

Space Grotesk supplies headings (600) and the brand (700); IBM Plex Mono supplies body copy and labels. Fonts are locally served. The frontmatter captures the base roles, while component overrides remain authoritative in CSS. Hero copy has a 380px maximum width and 1.7 line height.

**The Reading Rule.** Keep explanatory text readable and distinguish decorative micro-labels from essential controls. The general paragraph rule is 13px; several implemented explanations override it to 12px, and supporting notes use 10–11px. Mobile hero copy is 12px. Decorative instrumentation falls to 7–10px, including some motion/reset controls. The code therefore does not satisfy a blanket 13px minimum.

## Layout

A sticky 58px terminal header precedes the cinematic hero, four-feed selector, video/workflow workbench, tool inventory, illustrative sequence console, and final download. Standard section gutters are 24px; console seams are 7px. No general maximum-width container is imposed.

The hero has 12px outer horizontal margins, a 690px minimum height, and height min(830px,calc(100svh - 58px)). Its upper instruments use 260px / flexible / 245px columns. The workbench splits minmax(0,1.85fr) against minmax(280px,1fr); the system uses equal columns, and download uses 1.25fr / 1fr.

At max-width 1000px, instruments and workbench compress and center coordinates disappear. At max-width 760px, the header becomes 56px with an expandable menu, feeds become two columns, workbench/system/download stack, section gutters become 14px and console seams become 6px. The scene retains both instruments and its 690px minimum, with 7px outer margins. At max-width 380px, instrumentation compresses further and the hero heading becomes 36px. At min-width 1800px, hero height becomes 840px, main gutters become 4vw, and the hero heading reaches 92px.

Provenance: tokens were extracted from site.css, behavior from site.js, and structure from index.html. Deployment resources are named retro.css and retro.js; these match the local site.css/site.js implementations at documentation time.

## Elevation & Depth

There are no box-shadow tokens. Depth comes from original imagery, translucent near-black instruments, layered gradients, foreground dust, and restrained image parallax. Frames remain flat; grain belongs to the artwork rather than a full-page animated noise overlay.

One time-based requestAnimationFrame loop drives a 1200-point torus, radial graph and 180 spring-return dust particles. Motion pauses offscreen or when hidden; pause/play, reset and direct torus dragging remain available. Background scroll translation is capped at 45px. Reduced motion disables ambient motion and video autoplay by default, removes CSS animation/transitions and parallax, and preserves manual controls. Reveal uses opacity .7s, transform .85s, and cubic-bezier(.16,1,.3,1); workflow copy changes use .45s with the same curve.

## Shapes

Panels/actions use square corners and generally 1px borders. Corner brackets, crosshairs, diamond keyframes and round status points provide technical geometry. Status dots use a 50% radius. Logo presentation alone has small rounded corners: 5px in the header and 9px in download.

## Components

### Buttons

The download action uses amber fill, dark text, a 1px amber border, 15px 18px padding and 58px minimum height. Hover changes the fill to #f8d6aa and text to void. Text actions use amber, thin underlines and directional icons that translate 2px on hover. Focus is a 2px amber outline with 5px offset; button focus offsets inward by 4px.

### Feed selectors

Four framed thumbnail tabs have 2.35 image aspect ratio at base size. Selected state uses amber border/text and #1b1713 fill; hover uses cyan border and #111e23 fill. Images gain saturation and subtle scaling. Arrow keys, Home/End, roving tabindex and an associated panel support keyboard operation. Selection changes recording and explanatory copy together.

### Instruments and containers

Instrument title rows have a 31px minimum height and thin separating rule. General frames use line, the signal frame uses #355365, and study/video/system frames use magenta. Workflow explanation uses opaque panel fill and base padding 22px 28px.

### Navigation

Desktop navigation is centered independently of brand/status, with 11px uppercase mono labels, muted at rest and amber on hover/current section. Mobile expands below the header; Escape closes the menu and restores focus, and choosing a link closes it.

### Disclosures and format tags

Native details/summary elements expose inventory and checksum information. Inventory rows use dim dividers and plus icons rotate 45 degrees when open. Format tags use square 1px frames and cyan 9px text. This surface has no input fields.

### Media and scene controls

Recordings expose native controls, pause outside the viewport or when hidden, and show a direct-file fallback on load failure. Canvas art is illustrative. The torus uses grab/grabbing cursors and pointer capture, while touch allows vertical page panning.

## Do's and Don'ts

### Do:
- Do preserve the teal logo and cyan/amber/magenta instrument palette.
- Do label illustrations and use real recordings for product behavior.
- Do preserve visible focus, manual motion controls and readable explanations.
- Do retain mobile two-column feeds and stacked consoles.

### Don'ts:
- Don't invent performance statistics from decorative telemetry.
- Don't replace square console framing with generic rounded cards.
- Don't add download buttons to the header or hero; the main download belongs in the final section.
- Don't apply decorative micro-label sizing to explanatory copy.
