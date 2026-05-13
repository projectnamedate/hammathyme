Subset TTF cuts used by the generated Hammer social-preview images.

- `Outfit-Black-Social.ttf` — Outfit 900 from Google Fonts.
- `Geist-Regular-Social.ttf` — Geist 400 from Google Fonts.
- `Geist-Medium-Social.ttf` — Geist 500 from Google Fonts.
- `GeistMono-Medium-Social.ttf` — Geist Mono 500 from Google Fonts.

These files keep `/opengraph-image` and `/twitter-image` on the Hammer
typographic system instead of falling back to generic system fonts.
They are subset to ASCII plus `·` and stripped of unsupported layout tables so
Next's `ImageResponse` renderer can prerender the card.
