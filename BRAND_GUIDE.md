# hammer — Brand Tokens (machine-readable companion)

**v 3.0 · 2026.05.03 · Vinaceous Cinnamon · Polished Bloodlust**

The canonical brand guide is `BRAND.html` — open that for the visual reference.
This file is the **machine-readable token source** that compiles directly into `tailwind.config.ts`
and `app/globals.css` in Phase 1. Update this file in the same PR as any token change.

---

## 1. Locked decisions

- **Tagline:** hammer. ai producer.
- **Wordmark case:** lowercase only.
- **Display:** Outfit (free Google Fonts, weights 200–900) — Futura-direct geometric sans, Black 900 for the wordmark.
- **Body:** Geist (Vercel, free) — premium humanist grotesque.
- **Mono:** Geist Mono (Vercel, free) — pairs natively with Geist.
- **Editorial italic accent:** Instrument Serif Italic — used only for italicized words in headlines (the recurring motif), never as a primary face.
- **Live accent:** `#F28E86` (Vinaceous Cinnamon, OKLCH 75% 0.123 24.8). The period after `hammer.` is the brand mark.
- **Deep accent:** `#5A201D` (Polished Bloodlust) — hover/pressed states only.
- **Surface mode:** light, warm cream washed with rose. Dark mode not in scope.
- **Wordmark direction:** three options in `BRAND.html §02` — Jeff picks one.
- **Characters at launch:** 1 placeholder; real ones slot in post-launch.

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
- Recurring brand mark: the period after `hammer` in `--cinnamon`.
- Wordmark and primary headlines are **lowercase**. Captions and chips are uppercase mono.
- One `h1` per page; primary keyword in `h1`.
- Tracking: hero −0.06em, h2/h3 −0.045em, h4 −0.04em. Body 0.

**Loading strategy:** self-host all weights as WOFF2, subset Latin, preload Outfit 900 + Outfit 300 + Geist 400 + Geist 500.

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
| `tailwind.config.ts` | 1 | mirrors §2–§5 one-to-one |
| `app/globals.css` | 1 | declares all custom properties in `:root` |

## Changelog

- **v 3.0 · 2026.05.03** — Vinaceous Cinnamon palette per Jeff's reference. Display switched to Outfit (Futura-coded, free) at Black 900. Body switched to Geist. Wordmark case switched to lowercase. Three new directions: The Pure / The Producer / The Slate. Instrument Serif retained as italic-only editorial motif.
- **v 2.0 · 2026.05.03** — Light cream/oxblood pivot, Instrument Serif. Superseded.
- **v 1.0 · 2026.05.03** — Dark mode initial draft. Superseded.
