# kira brand bible

**the single source of truth for every kira decision.**
if something isn't in here, it isn't kira.

- **version** 1.0.0 · issued 2026-04-13
- **owner** projectnamedate LLC
- **viewable** open `index.html` in any browser; no build step, no server
- **portable** plain HTML + CSS + Google Fonts CDN — self-contained, works offline after first font load

## structure

```
docs/brand/
├── index.html              cover + TOC
├── 01-essence.html         ... through 14-appendices.html
├── styles.css              master stylesheet (design tokens + editorial + tech-spec + print)
├── tokens.json             design + post-recipe tokens, pipeline-consumable
├── source/                 markdown sources for each section (the editable layer)
├── assets/                 hero imagery, do/don't grids, cover art
├── README.md               this file
└── CHANGELOG.md            version history + rationale
```

## how to use

1. **answer a question** — use the TOC in `index.html` to jump to the relevant section
2. **generate content for kira** — read section 03 (voice) + section 04 (visual) + section 06 (content)
3. **respond to a crisis** — section 10 (crisis playbook) + section 09 (decision trees)
4. **close a brand deal** — section 08 (monetization + rate card)
5. **run a monthly audit** — section 12 (KPIs + brand-audit scorecard)
6. **generate images/video** — import `tokens.json` → `color.*` + `lens.*` + `light.*` + `grade.*` match the locked post-process recipes in `/Users/hammer/.claude/projects/-Users-hammer-Desktop-Claude-aiugc/memory/reference_kira_postprocess_v8.md`

## how to update

- edit markdown in `source/` (the authoritative prose layer)
- regenerate the corresponding HTML page (or let a future build script do it)
- bump version in `tokens.json` → `meta.version` (semver: major for breaking voice/visual change, minor for scope add, patch for copy fix)
- log the rationale in `CHANGELOG.md` — **why** matters more than **what**
- every change is signed by projectnamedate LLC

## governance (short version — full in section 13)

- voice / visual / taboo changes → require explicit approval, log rationale
- copy-fix, typo, new sample rewrite → low-friction edit
- never modify `tokens.json` without updating the pipeline recipes in sync
- quarterly review cadence; immediate ad-hoc review after any P0/P1 crisis

## derived from

- `/Users/hammer/Desktop/Claude/kira/CLAUDE.md` — project rules
- `/Users/hammer/Desktop/Claude/kira/characters/kira.yaml` — identity source
- `/Users/hammer/.claude/projects/-Users-hammer-Desktop-Claude-aiugc/memory/reference_kira_postprocess_v8.md`
- `/Users/hammer/.claude/projects/-Users-hammer-Desktop-Claude-aiugc/memory/reference_kira_character_bible.md`
- `/Users/hammer/.claude/projects/-Users-hammer-Desktop-Claude-aiugc/memory/x_growth_strategy.md`
- `/Users/hammer/.claude/projects/-Users-hammer-Desktop-Claude-aiugc/memory/reference_kira_legal_compliance.md`
- research: 3 parallel agents (AI influencer benchmark, human influencer brand craft, crypto twitter female personas), self-verified against primary sources 2026-04-13

## external references used in research

| what | where | confidence |
|---|---|---|
| Aitana Lopez benchmark | Euronews, Entrepreneur, virtualhumans.org | verified |
| Lil Miquela revenue + acquisitions | HypeAuditor, TechCrunch, MM+M | verified (revenue-per-post headline) / flagged (30-day figure, HypeAuditor 403 on independent reverify) |
| Emily Pellegrini revenue arc | Fortune, The Tab | Fortune $23K Jan 2024 figure verified direct; decay direction supported but specific $11K/mo figure not cleanly sourced |
| Milla Sofia trajectory | virtualmarketermax, Favikon 2026 | inferred from multiple secondary |
| Imma brand roster | aww.tokyo, virtualhumans.org | verified |
| CoinGecko crypto-AI trust survey (n=2632) | coingecko.com/research | verified direct — **26.6% high trust AI KOLs vs 21.4% humans** |
| CT slang register 2026 | Decrypt, Gate.com, BitMEX, Watcher Guru | inferred |
| HAWK/JENNER/MOTHER cautionary pattern | The Ringer, Cointelegraph | verified |
| Top female CT handles + followers | x.com live scrape via Playwright, 2026-04-13 | verified direct |
