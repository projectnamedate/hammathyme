# Global Codex Defaults

- For underspecified coding tasks, normalize the request into goal, context,
  constraints, and done criteria before implementing. Infer from local docs and
  repo state when safe; ask only for blocking or high-risk ambiguity.
- Use `$codex-workflow-guardrails` for complex, ambiguous, multi-step,
  high-risk, live-runtime, repo-takeover, reusable-guidance, or
  verification-heavy work.
- Plan before editing when risk or ambiguity is real. For simple low-risk
  tasks, execute directly.
- Before finalizing code edits, run the most relevant validation available and
  inspect the diff. If validation cannot run, say exactly why.
- When a correction repeats, move it into the smallest durable surface:
  `AGENTS.md` for always-on behavior, a focused skill for repeatable workflows,
  MCP for changing external context, and automation only after the manual
  workflow is reliable.

## Rive Puppet Gate

- Before any Rive puppet vector rebuild, rigging, animation, runtime package
  install, or site integration, run `npm run verify:rive-puppet`.
- Treat `content/work/rive-puppet-approval-manifest.json` as the source of
  truth for the current approval state.
- Do not create `public/work/animation/hammer-puppet-rig.riv` or
  `public/work/animation/hammer-puppet-rig-poster.png` while the manifest says
  `approvalStatus: pending`.
- Do not proceed past the approval board until Jeff explicitly approves
  candidate 01 or candidate 02, or gives design changes to apply first.
