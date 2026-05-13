# hammer — Brand Tokens (machine-readable companion)

**v 3.0 · 2026.05.03 · Vinaceous Cinnamon · Polished Bloodlust**

The canonical brand guide is `BRAND.html` — open that for the visual reference.
This file is the **machine-readable token source** that compiles directly into
`app/globals.css` and the Tailwind v4 CSS theme map. Update this file in the
same PR as any token change.

---

## 1. Locked decisions

- **Tagline:** hammer. ai producer.
- **Wordmark case:** lowercase only.
- **Display:** Outfit (free Google Fonts, weights 200–900) — Futura-direct geometric sans, Black 900 for the wordmark.
- **Body:** Geist (Vercel, free) — premium humanist grotesque.
- **Mono:** Geist Mono (Vercel, free) — pairs natively with Geist.
- **Editorial italic accent:** Instrument Serif Italic — used only for italicized words in headlines (the recurring motif), never as a primary face.
- **Live accent:** `#F28E86` (Vinaceous Cinnamon, OKLCH 75% 0.123 24.8). The period after `hammer.` is the protected brand mark; see the dot / period system below.
- **Deep accent:** `#5A201D` (Polished Bloodlust) — hover/pressed states only.
- **Surface mode:** light, warm cream washed with rose. Dark mode not in scope.
- **Wordmark direction:** canonical recipe is Motion Reel `01 - cold open`, mirrored in the fixed Remotion `15 - signature` treatment. Use the cold-open per-letter Outfit Black construction; do not replace it with the native `.kw` text run.
- **Characters at launch:** Kira is the canonical autonomous-character source; the public agents case study is still being built.

## 2. Color tokens

```css
:root {
  /* Page surfaces — warm cream washed with rose */
  --cream-0: #FAEEE9;   /* page */
  --cream-1: #F2DDD4;   /* card surface */
  --cream-2: #E5BFB4;   /* deep cream — accent surface */

  /* Ink — deep maroon ramp */
  --ink-0:        #1F0707;   /* primary text */
  --ink-1:        #3D1413;   /* secondary */
  --ink-2:        #6E2C27;   /* muted, captions */
  --ink-3:        #A66860;   /* subtle, hairlines */
  --ink-4:        #C99891;   /* faintest divider */
  --ink-deepest:  #0F0303;   /* used rarely; OG card backgrounds */

  /* Live accent — Vinaceous Cinnamon */
  --cinnamon:    #F28E86;
  --cinnamon-h:  #EE7A71;

  /* Deep accent — Polished Bloodlust */
  --bloodlust:   #5A201D;

  /* Semantic */
  --border:        rgba(31, 7, 7, 0.10);
  --border-strong: rgba(31, 7, 7, 0.20);
  --focus-ring:    rgba(242, 142, 134, 0.55);
  --success:       #2E6B47;
  --error:         #5A201D;
}
```

**Contrast (WCAG):**
- ink-0 on cream-0 → 14.2 : 1 (AAA)
- ink-1 on cream-0 → 8.4 : 1 (AAA)
- ink-2 on cream-0 → 5.0 : 1 (AA body)
- bloodlust on cream-0 → 7.6 : 1 (AAA)
- cinnamon on cream-0 → 2.4 : 1 (UI graphic only — never body text)
- ink-0 on cinnamon → 5.9 : 1 (AA body — usable for button text)

## 3. Typography

```css
:root {
  --font-display: 'Outfit', 'Futura', 'Avenir Next', system-ui, sans-serif;
  --font-body:    'Geist', 'Inter Tight', -apple-system, system-ui, sans-serif;
  --font-mono:    'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
  --font-serif:   'Instrument Serif', 'Tiempos Headline', Georgia, serif;  /* italic-only motif */
}
```

**Type scale (1.25 modular, 9 steps):** `12 · 14 · 16 · 20 · 24 · 32 · 48 · 72 · 112` (px).

**Heading rules:**
- All headings set in **Outfit**, weight 700–900.
- All body copy set in **Geist**, weight 400 (regular) and 500 (emphasis).
- Recurring motif: a single italic word in a headline, set in **Instrument Serif Italic** (the only place serif appears).
- Recurring dot usage is governed by the dot / period system below.
- Wordmark and primary headlines are **lowercase**. Captions and chips are uppercase mono.
- One `h1` per page; primary keyword in `h1`.
- Tracking: hero −0.06em, h2/h3 −0.045em, h4 −0.04em. Body 0.

**Loading strategy:** self-host all weights as WOFF2, subset Latin, preload Outfit 900 + Outfit 300 + Geist 400 + Geist 500.

### Canonical wordmark recipe

Reference implementations:

- `/Users/hammer/Desktop/Claude/motion-reel/hyperframes/reel/01-cold-open/index.html`
- `/Users/hammer/Desktop/Claude/motion-reel/remotion/src/reel/15-Signature.tsx`

- Render `hammer` as six Outfit Black letter spans, not one native text run. The approved visual recipe is the cold-open per-letter construction.
- Font: `Outfit`, weight `900`, lowercase only. In Remotion, use a dedicated local `@font-face` for the wordmark so shared font-family fallback cannot drift the render.
- Cold-open reference size: `font-size: 280px`, `line-height: 0.84`, `letter-spacing: 0`.
- Reel signature size: `font-size: 228px`, `line-height: 0.84`, `letter-spacing: 0`, with dot dimensions scaled from the cold-open 280px geometry.
- Letter wrapper recipe: each letter uses `display: inline-block`, `overflow: hidden`, `line-height: 1.28`, `padding: 0.22em 0`, `margin-top: -0.22em`, and `margin-bottom: -0.22em`.
- Letter gaps after `h a m m e r`: `-0.018em`, `-0.055em`, `-0.045em`, `-0.030em`, `-0.022em`, `0.007em`.
- Period: render as a controlled cinnamon circle, not the font period glyph. Cold-open reference is `48px` circle at `280px` type with `margin-left: 2px`, `margin-bottom: 6px`, and absolute `top: -78px`; scale those pixel values proportionally for other reel sizes.
- Color: wordmark in `--ink-0`; period in `--cinnamon`.
- Keep `font-kerning: normal`, `font-feature-settings: "kern" 1, "calt" 1`, `text-rendering: geometricPrecision`.

### Dot / period system

The cinnamon dot has two approved roles:

1. **Protected brand mark.** Only `hammer.` gets the canonical brand mark. Render `hammer` with the cold-open per-letter Outfit Black recipe and render the period as a controlled circular element, never the font period glyph. The dot is always `--cinnamon`, baseline-aligned, and proportioned from the canonical wordmark recipe above.
2. **Display punctuation motif.** A single cinnamon dot may punctuate a bold Outfit/Geist display title when it is acting as a deliberate title lockup, not as ordinary grammar. It must be a controlled circular element in `--cinnamon`, not a typed period colored pink.

Do not:

- attach the cinnamon dot to Instrument Serif italic words or all-italic lines;
- use the cinnamon dot as a generic bullet, metadata separator, item marker, or every-label punctuation;
- color typed period glyphs in `--cinnamon` or `--bloodlust` as a substitute for the controlled circular mark;
- use `--bloodlust` for punctuation dots. `--bloodlust` remains a deep accent for hover/pressed states and selected dark details.

Use normal text-color punctuation for body copy, all-italic lines, and ordinary sentences when punctuation is needed. Mono metadata uses `·` or `/`, not the brand dot. Functional circles such as chart markers, cursor dots, particles, and graph nodes are not sentence punctuation; they may use brand colors when they are part of the data or motion system.

## 4. Motion

```css
:root {
  --ease-cinema:   cubic-bezier(0.65, 0, 0.35, 1);
  --ease-shutter:  cubic-bezier(0.85, 0, 0.15, 1);
  --ease-soft:     cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-instant:    100ms;
  --duration-quick:      200ms;
  --duration-standard:   400ms;
  --duration-slow:       600ms;
  --duration-cinematic:  1000ms;
}
```

Five principles (per BRAND.html §05). Every animation has a `prefers-reduced-motion` fallback.
Eight motion primitives: `<FadeIn>`, `<StaggerChildren>`, `<ScrollReveal>`, `<Shutter>`, `<SplitText>`, `<Marquee>`, `<TiltCard>`, `<Cursor>`.

## 5. Spacing, radius, borders, z-index

```css
:root {
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --space-9: 96px; --space-10: 128px;

  --radius-0: 0px; --radius-1: 2px; --radius-2: 4px; --radius-3: 8px; --radius-4: 16px;

  --bw-1: 1px; --bw-2: 2px; --bw-3: 3px;

  --z-base: 0; --z-texture: 10; --z-content: 20; --z-cursor: 30;
  --z-nav: 40; --z-overlay: 50; --z-modal: 60; --z-toast: 70;
}
```

## 6. Voice

**Banned words (CI-enforced):**
`unleash · harness · revolutionize · supercharge · game-changing · next-level · leverage · synergy · cutting-edge · seamless · robust · empower · disrupt · tap into · the power of AI`

**Sentence target:** avg 12 words, hard cap 25.
**Capitalization:** body and UI in sentence case; wordmark + section headings in lowercase; mono captions in lowercase; banned words list above is the only ALL-CAPS-IN-CONTEXT.

## 7. Files this guide compiles into

| File | Phase | Source |
|---|---|---|
| `BRAND.html` | 0 | canonical visual reference |
| `BRAND_GUIDE.md` | 0 | this file — machine-readable tokens |
| `brand/wordmark-{a,b,c}.svg` | 0 | three directions to pick from |
| `brand/icon.svg` | 0 | mark-only |
| `brand/grain.svg` | 0 | paper-grain texture |
| `brand/og-template.tsx` | 1 | next/og social image template |
| `app/globals.css` | 1 | declares all custom properties in `:root` and maps Tailwind v4 theme utilities |

## Changelog

- **v 3.0 · 2026.05.03** — Vinaceous Cinnamon palette per Jeff's reference. Display switched to Outfit (Futura-coded, free) at Black 900. Body switched to Geist. Wordmark case switched to lowercase. Three new directions: The Pure / The Producer / The Slate. Instrument Serif retained as italic-only editorial motif.
- **v 2.0 · 2026.05.03** — Light cream/oxblood pivot, Instrument Serif. Superseded.
- **v 1.0 · 2026.05.03** — Dark mode initial draft. Superseded.
