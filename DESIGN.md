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
    fontFamily: '"Orbitron","Space Grotesk",sans-serif'
    fontSize: "clamp(36px,4.5vw,70px)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: ".015em"
  headline:
    fontFamily: '"Orbitron","Space Grotesk",sans-serif'
    fontSize: "clamp(32px,3.7vw,56px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: ".015em"
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
  console-gap: "9px"
  mobile-console-gap: "7px"
  section-gutter: "24px"
  mobile-section-gutter: "14px"
components:
  download-button:
    textColor: "#0c141a"
    padding: "17px 20px"
    rounded: "{rounded.panel}"
  feed-tab:
    padding: "7px"
    rounded: "{rounded.panel}"
  feed-tab-selected:
    textColor: "#10171c"
---

# Design System: GauRush

## Overview

**Creative North Star: "The Spatial Monitoring Station"**

The user-confirmed world combines retro-futuristic monitoring instruments with grainy ocean/chrome imagery. The later user-supplied Y2K metallic UI-kit reference refines that world with angular silver bevels and Orbitron titles. Near-black asymmetric consoles and cyan/amber/magenta instruments remain beneath the chrome layer. The text-free teal logo remains the identity anchor.

The user-supplied looping background video and canvas studies supply atmosphere; real application recordings supply product evidence. The timeline remains explicitly illustrative. This document describes the final cascade: base retro.css (local site.css), then chrome.css, then kit-assets.css and kit.css. Base behavior remains retro.js (local site.js); kit.js connects the supplied tool artwork to real page workflows; background-media.js supplies embedded media and motion.js coordinates the final motion layer.

**Key Characteristics:**
- Cinematic image depth with double-beveled chamfered instruments.
- Metallic Orbitron headings and compact IBM Plex Mono explanations.
- Asymmetric workstation density and silver selected controls.
- Controllable live studies and real recordings.

## Colors

The frontmatter preserves the exact base root color tokens. Cyan, amber and muted magenta remain instrument accents, with mint status points and near-black neutral layers. Raised is declared but currently unused directly. The final chrome layer replaces amber primary-action fill and selected-feed title fills with silver gradients; it also replaces cyan heading emphasis with unified metallic text.

The normative chrome gradient is `--chrome: linear-gradient(180deg,#fff 0%,#eef4f7 18%,#a7b6c1 38%,#f9ffff 45%,#e7f5fb 49%,#7f96a5 52%,#c1d0d9 72%,#fff 84%,#aebfc9 100%)`. The normative bevel gradient is `--metal-edge: linear-gradient(145deg,#f0f5f8 0%,#8c9ca7 15%,#e4eff3 24%,#53616d 42%,#ecf7fc 52%,#adb9c3 70%,#495b66 83%,#d1e3eb 100%)`. These multi-stop materials belong in the sidecar rather than the color primitives.

**The Evidence Rule.** Decorative telemetry must not imply measured application performance.

## Typography

Orbitron is the final display family, with Space Grotesk and sans-serif fallbacks. Headings and brand use weight 600. IBM Plex Mono remains the body and telemetry family. Display and workspace-heading tokens in frontmatter reflect the desktop base of the final cascade. System headings use clamp(30px,3.35vw,50px), download headings clamp(30px,3.6vw,53px), and workflow titles clamp(27px,3.1vw,45px). Hero secondary lines are .73em, falling to .72em at 380px. Heading tracking is .015em, except workflow titles at 0.

Heading metallic fill uses background clipping, transparent text fill, a .25px #b3c4cf stroke and drop-shadow(0 2px 1px #000b). Forced-colors restores CanvasText and removes the background, stroke and filter.

Orbitron is served locally as an embedded TrueType data URL in chrome.css, supporting weights 400–900 with font-display:swap. Its source file is assets/orbitron.ttf; assets/Orbitron-OFL.txt records Copyright 2018 The Orbitron Project Authors (https://github.com/theleagueof/orbitron), Reserved Font Name Orbitron, under SIL Open Font License 1.1. Keep that license with redistributed font assets. No external runtime font request is required.

**The Reading Rule.** Keep explanatory text readable and distinguish decorative micro-labels from essential controls. General paragraphs remain 13px, but component overrides include 12px explanatory copy and 10–11px notes. Chrome instrumentation reaches 7px at 760px and some labels/motion controls reach 6px at 380px. The implementation does not satisfy a blanket 13px minimum.

## Layout

A sticky 58px terminal header precedes the cinematic hero, four-feed selector, video/workflow workbench, inventory, illustrative sequence console and final download. Standard section gutters remain 24px; workbench and system console seams become 9px. The feed strip uses 9px seams, changing to 7px at 760px; base mobile workbench/system seams remain 6px. No general maximum-width container is imposed.

Hero outer margins and 690px minimum remain from the base. Its upper grid becomes 270px / flexible / 265px; final desktop hero copy is capped at min(790px,calc(100% - 80px)). Workflow explanation padding becomes 26px 30px.

The base max-width 1000px compact layout remains active. The chrome layer additionally compresses type and instruments at max-width 1100px, with upper columns 240px / flexible / 235px. At max-width 760px, the header is 56px, menu expands, feeds become two columns, console sections stack, gutters are 14px and instruments use flexible / 175px columns. At max-width 380px the right instrument is 155px and hero heading 32px. From 1800px, hero is 840px high, gutters 4vw, instruments 320px / flexible / 300px, hero heading 82px, workspace heading 66px and system/download headings 64px.

Provenance: base tokens and behavior derive from site.css/site.js, deployed as retro.css/retro.js. chrome.css is the later user-authorized refinement and must load after retro.css. All values above describe that cascade.

The final kit layer places the supplied desktop brandplate in the hero center at a maximum 480px width (570px from 1800px, 360px below 1100px, hidden at 1000px). A ribbon and star separator occupies 120px height between hero and workspace, changing to 140px wide, 100px at 1100px, 90px mobile and 78px at 380px. Workspace top padding is now 18px desktop and 9px mobile. The system explanation gains an orbital illustration in a 112px second column, with 132px wide, 90px compact/mobile and 70px small-phone variants. Kit format badges align right on desktop and left on mobile. A barcode and three tool links share a row, stacking below 760px; links retain at least 44px height. The footer gains a decorative star on desktop. Original typography and chrome/base tokens above remain normative except these explicit final-layer overrides. Mobile system-description text is 11px.

## Elevation & Depth

There are no ambient card-shadow tokens. The chrome layer adds heading drop-shadow(0 2px 1px #000b) and inset 4px focus shadows to the download action and workflow panel. Depth comes from original imagery, translucent near-black instruments, layered gradients, foreground dust, and restrained image parallax. Chrome bevels add edge relief while panel planes remain flat; grain belongs to the artwork rather than a full-page animated noise overlay.

One time-based requestAnimationFrame loop drives a 1200-point torus, radial graph and 180 spring-return dust particles. Motion pauses offscreen or when hidden; pause/play, reset and direct torus dragging remain available. Background scroll translation is capped at 45px. Reduced motion disables ambient motion and video autoplay by default, removes CSS animation/transitions and parallax, and preserves manual controls. Reveal uses opacity .7s, transform .85s, and cubic-bezier(.16,1,.3,1); workflow copy changes use .45s with the same curve.

### Video-backed scene and final motion layer

The final hero and download backgrounds use the unchanged supplied WebM: 1280×720, 4.042 seconds, 466,066 bytes. Source is gaurush_lightweight.webm; local copy assets/gaurush-background.webm. SHA-256 is f7251dc20ecc089cfb37355d3f56d43dfa6ea5d3590c366b94629428477aac96. The media manifest is .impeccable/background-media.json. Public delivery embeds the media in background-media.js without an external runtime dependency. The real-frame poster assets/background-poster.jpg was extracted with browser canvas at JPEG quality .88. Existing generated scene artwork remains a base asset; the final media layer replaces its scene-image variable with the supplied-video poster.

Both native video elements are muted, autoplay, loop and playsinline, decorative, untabbable and pointer-inert. Only a visible section plays while master motion is enabled and the document is visible; hidden/offscreen sections pause. Hero preload is auto and download preload none. A blocked autoplay attempt exposes Play background video; a decoding error returns to the poster. Reduced-motion users start on the poster without autoplay. The master instrument control and final-section background-motion control share state and label updates.

Video fades in over .8s with cubic-bezier(.16,1,.3,1). Hero positioning is center 54%, mobile 62% center; download positioning is center 65%, mobile 60% center. The poster remains underneath during loading/failure. A 700ms startup sequence assembles left instrument from −18px, right instrument from +18px after 110ms, wordmark from −10px vertically after 190ms, hero title from +9px after 260ms and body from +7px after 330ms. Each resolves opacity .2→1 and blur 2px→0 with the same ease; hidden elements are skipped.

Interaction glints cross selected/hovered/focused feeds and hovered/focused download over .85s. Visible ribbon motion is 9s ease-in-out (±3px and ±.35deg), stars 5.5s ease-in-out (.94→1.07 scale, .65→1 opacity; last star delay −2.75s), orbital artwork 48s linear rotation, and illustrative timeline 10s cubic-bezier(.45,0,.55,1). Timeline travel is min(115px,16% of its width). Intersection observation activates these at 5% visibility; master pause freezes ambient animation. Glints and hover responses remain interaction-triggered rather than ambient. Final tool-link hover becomes −3px and brightness(1.12), with transform .3s cubic-bezier(.16,1,.3,1) and filter .3s.

Inventory disclosure open/close animates actual height for 300ms using cubic-bezier(.16,1,.3,1). Repeated clicks cancel and reverse from the current height; completion settles native open state. Reduced motion preserves instant native details behavior. Enabling reduced motion or pausing master finishes startup and settles pending disclosure transitions. Existing reduced-motion CSS also removes transitions/glints/parallax; all earlier product and keyboard behavior remains.

## Shapes

The final material is chamfered chrome rather than plain square framing. Instruments, feed selectors, demo/workflow containers, inventory, sequence console and download share an eight-point clip-path with 14px corner cuts. Their original borders are removed. A 3px gradient outer bevel and a 1px translucent inner bevel inset 6px create the double frame. Inner corners use 9px cuts. Both pseudo-layers ignore pointer events.

Navigation uses opposing 10px diagonal cuts; download action uses 13px cuts and an inset 5px inner outline. Format badges use opposing 5px cuts. Status points remain circular; logo corner radii remain from the base. Forced-colors removes panel clipping/bevel layers and restores simple CanvasText borders.

## Components

### Buttons

The download action now uses an Orbitron 600 silver gradient, dark #0c141a text, 17px 20px padding and a 62px minimum height. At 760px padding is 16px; font size is 10px, falling to 9px at 380px. Hover shifts to a cool silver gradient and #030b0f text. Focus replaces the external outline with a 4px inset cyan box-shadow so the chamfer does not clip it. Text actions retain amber but hero exploration adopts 10px Orbitron. Other controls retain the base 2px amber focus treatment.

### Feed selectors

Feeds gain 7px interior padding (6px mobile), 14px chamfers and double bevels. Selected outer bevel mixes silver, cyan and amber; selected title/index use dark text over a silver gradient. The base amber selected background remains under the title and imagery. Hover outer bevel becomes white/cyan. Keyboard arrows, Home/End, roving tabindex and linked recording/copy changes remain unchanged.

### Instruments and containers

Instruments use a dark diagonal gradient and title rows with 36px minimum height and 9px 15px padding. Demo/inventory/sequence containers receive 7px inner padding. Workflow explanation has 26px 30px padding, striped header ornament and dark gradient; focused panel uses a 4px inset amber box-shadow. These focus shadows and heading drop-shadows are functional/decorative accents, not floating-card elevation.

### Navigation

The brand becomes Orbitron 600, 17px desktop and 16px mobile, with metallic clipped text and cyan period. Desktop navigation uses 9px Orbitron 500, 8px gaps, 9px 17px padding and a 34px minimum height. Active and hovered links use dark text over silver fill. Mobile menu labels are 9px, expanded links 13px. Existing Escape, focus restoration and link-close behavior remain unchanged.

### Disclosures and format tags

Native details/summary behavior remains. Open inventory rows receive a dark horizontal gradient. Format badges become Orbitron 9px, silver text/stroke, dark metallic fill and 7px 12px padding; mobile uses 8px and 7px 9px. There are no input fields.

### Media and scene controls

Real recordings, native controls, fallback links, visibility pausing, keyboard feed selection and the live torus/dust/radial loop remain from retro.js. chrome.css changes their framing and typography without changing behavior. Torus height becomes 135px desktop, 160px wide and 92px mobile. Reduced-motion rules remain authoritative; forced-colors restores legible headings and simple panel/action borders.

### Supplied artwork and real tool anchors

The final kit layer reuses twelve user-supplied transparent PNGs from Downloads/gaurush web elements. Ten original artwork assets are retained in the local website/published/assets/kit-{brandplate,ply,sog,ribbon,orbit,star,barcode,export,timeline,editor}.png files. Their pixels are embedded in kit-assets.css; kit.css contains the editable placement and cursor rules. This refinement performs no image generation or redraw. ASSETS.md owns detailed provenance; existing scene-art provenance remains unchanged.

The brandplate, ribbon, stars, orbit and barcode are decorative and hidden from assistive technology. PLY/SOG badges carry role=img and explicit support labels. The three artwork tool anchors have accessible text: Editor selects the view demo and links to workspace; Timeline selects the animate demo and links to workspace; Export opens the last inventory disclosure and links to features. These are actual page actions, not decorative controls. The kit base translates tool links upward 2px over .2s; final motion.css overrides this to 3px over .3s and use a 2px amber focus outline offset 2px. Reduced motion removes that transition. Forced-colors outlines the anchors, exposes their accessible text visually, and hides the image artwork inside them.

### Native cursor states

On devices matching hover:hover and pointer:fine, the white supplied cursor is the page default with hotspot (6,6), while orange indicates links, buttons, summaries and tabs with hotspot (8,6). Cursor PNGs are proportional 40×47 derivatives of user-supplied Layer-26 and Layer-25 assets with transparency preserved. Native fallbacks are auto and pointer respectively. Text fields/contenteditable retain text cursors; video retains auto; the torus retains grab/grabbing. Touch and coarse pointers do not receive custom cursor styling.

## Do's and Don'ts

### Do:
- Do preserve the teal logo, silver Y2K material and cyan/amber/magenta instrumentation.
- Do label illustrations and use real recordings for product behavior.
- Do preserve visible focus, manual motion controls and readable explanations.
- Do retain mobile two-column feeds and stacked consoles.

### Don'ts:
- Don't invent performance statistics from decorative telemetry.
- Don't replace chamfered double-bevel console framing with generic rounded cards.
- Don't add download buttons to the header or hero; the main download belongs in the final section.
- Don't apply decorative micro-label sizing to explanatory copy.
