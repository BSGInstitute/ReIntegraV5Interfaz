# Skill Registry — IntegraV5Interfaz

Generated: 2026-05-13

## User-Level Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `branch-pr` | Create PR, open PR, prepare changes for review | `~/.claude/skills/branch-pr/SKILL.md` |
| `bsg-sql` | Validate/generate SQL Server code per BSG standardization guide | `~/.claude/skills/bsg-sql/SKILL.md` |
| `chained-pr` | Split large changes into chained/stacked PRs (>400 LoC) | `~/.claude/skills/chained-pr/SKILL.md` |
| `cognitive-doc-design` | Write docs/READMEs/RFCs with progressive disclosure | `~/.claude/skills/cognitive-doc-design/SKILL.md` |
| `comment-writer` | Draft warm, direct comments for PRs/issues/reviews | `~/.claude/skills/comment-writer/SKILL.md` |
| `go-testing` | Go tests, Bubbletea TUI testing | `~/.config/opencode/skills/go-testing/SKILL.md` |
| `issue-creation` | Create GitHub issue, report bug, request feature | `~/.claude/skills/issue-creation/SKILL.md` |
| `judgment-day` | Parallel adversarial dual-review protocol | `~/.config/opencode/skills/judgment-day/SKILL.md` |
| `skill-creator` | Create new skills, add agent instructions | `~/.config/opencode/skills/skill-creator/SKILL.md` |
| `skill-registry` | Create/update skill registry; `.atl/skill-registry.md` | `~/.config/opencode/skills/skill-registry/SKILL.md` |
| `work-unit-commits` | Structure commits as deliverable work units | `~/.config/opencode/skills/work-unit-commits/SKILL.md` |

## Project-Level Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `validar-publicacion` | "validar publicacion", "validar build", "preparar deploy", `/validar-publicacion` | `.claude/skills/validar-publicacion/SKILL.md` |

## Project Conventions

| File | Description |
|------|-------------|
| `AGENTS.md` | Agent skills index — references `validar-publicacion` |
| `.editorconfig` | Editor formatting rules |

## SDD Skills (orchestrator-managed, not directly invoked)

sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive, sdd-onboard, sdd-archive

## Notes

- Project uses Angular **13.3** (NgModule-based, no standalone components)
- No ESLint/TSLint configured at project root — only `.editorconfig`
- Testing: Jasmine + Karma (default Angular 13 setup) — available but **opted-out** for current change cycle
- No CI configuration detected in project root (no `.github/`, no `azure-pipelines.yml`, no `.gitlab-ci.yml`)
- TypeScript strict mode enabled but `strictNullChecks` and `strictPropertyInitialization` are OFF
- TS path aliases: `@shared/*`, `@environments/*`, `@gestionPersonas/*`, `@comercial/*`, `@operaciones/*`, `@integra/*`, etc.
