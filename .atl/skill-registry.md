# Skill Registry — IntegraV5Interfaz

Generated: 2026-03-23

## User-Level Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `go-testing` | Go tests, Bubbletea TUI testing | `~/.claude/skills/go-testing/SKILL.md` |
| `skill-creator` | Create new skills, add agent instructions, document patterns for AI | `~/.claude/skills/skill-creator/SKILL.md` |

## Project-Level Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `validar-publicacion` | "validar publicacion", "validar build", "preparar deploy", `/validar-publicacion` | `.claude/skills/validar-publicacion/SKILL.md` |

## Project Conventions

| File | Description |
|------|-------------|
| `AGENTS.md` | Agent skills index — references `validar-publicacion` |

## SDD Skills (orchestrator-managed, not directly invoked)

sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive

## Notes

- Project uses Angular 13.3 (NgModule-based, no standalone components)
- No ESLint/TSLint configured at project root — only EditorConfig
- Testing: Jasmine + Karma (default Angular 13 setup)
- No CI configuration detected in project root
