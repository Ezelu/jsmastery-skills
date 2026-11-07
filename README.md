# Engineering Workflow Skills

A set of [Agent Skills](https://agentskills.io) that take a change from a vague idea to shipped, tested, documented code, for any AI coding agent. One skill per phase. Run only the ones a change needs, in any order.

The state lives in files (a scope, specs, AGENTS.md, tests), not in a chat session. So work survives across sessions, picks up where it left off, and works for a whole team.

```
idea -> /scope -> /audit -> /architect -> /develop -> /check verify -> /test -> /check review -> /document -> /sync
```

Run `/debug` anytime something breaks. Run a bare `/scope` anytime to see where things stand. Run `/standup` to pick work back up without reading the repo again.

> **This is a fork.** The phase workflow is [JavaScript Mastery's skills suite](https://github.com/JavaScript-Mastery-Pro/skills), MIT licensed. I cut it from nine multi file skills down to one file per skill, dropped subagents and the second model review, and replaced the four workflow tiers with one column. The reasoning for each cut is in **[docs/why-this-fork.md](docs/why-this-fork.md)**. Everything that survived is still theirs in spirit; everything that changed is a decision I made and can defend.

## The skills

| Skill | What it does |
|---|---|
| `scope` | Turns an idea into an ordered plan at `docs/scope/scope.md` and keeps it true as you ship. |
| `audit` | Reads the real project and writes the `AGENTS.md` context files every other skill reads. |
| `architect` | Makes one load bearing decision and writes it as a spec in `docs/specs/`. The one gate. |
| `develop` | Builds a feature from its spec and self checks it against the numbered criteria. |
| `check` | `verify` drives the real app against the criteria. `review` reads the diff cold for what running it would miss. |
| `test` | Writes the tests that keep a change working, named after the criteria they prove. |
| `document` | Writes the PR body, changelog, release note, or postmortem from the real diff. |
| `sync` | Brings AGENTS.md, the scope, and spec statuses back in line with the code after a merge. |
| `debug` | Proves a root cause, makes the minimal fix, and hands a regression test to `test`. |
| `standup` | Prints one screen: what moved in git, what is blocked, which specs owe a decision. Read only. |

Every skill is a single `SKILL.md`. There are no mode files, no bundled prompts, no separate guides. The heaviest is under 650 words, because a file that loads on every run should fit on one screen.

## Install

Uses [npx skills](https://github.com/vercel-labs/skills). Pick your agent:

```bash
# Claude Code (installs into .claude/skills, then restart Claude Code)
npx skills@latest add Ezelu/jsmastery-skills -a claude-code

# Generic .agents/skills, read by Codex and other agents
npx skills@latest add Ezelu/jsmastery-skills
```

Works on any Agent Skills client (Claude Code, Cursor, Codex, Gemini CLI, and [more](https://agentskills.io/clients)). Commit the installed skills folder to share the workflow with your team.

On a free tier, see **[Running these skills without a paid plan](docs/clients.md)** for the per client skills directories and the Gemini CLI setup.

## Where to start

**New product:** `/scope` the idea, then `/architect` the stack, then scaffold, then `/audit` to seed AGENTS.md from the real project, then the feature loop.

**Existing codebase:** `/audit` first so every skill knows the project, then `/scope` the next slice, then the loop.

**Any single change:** run only what it needs. A bug goes straight to `/debug`. A small change can be `/develop` then `/check verify`.

## The one gate

There is exactly one enforced rule: **a load bearing decision gets written down before it gets built.**

`/develop` runs a check before touching code. It lists every value the feature must produce and asks, for each, does the spec name where it comes from? A named source means build. An unnamed source means a decision is owed, and there are three answers: stop and go to `/architect`, build anyway and record the assumption as an `assumed` spec that stays flagged until ratified, or build something else.

Everything else after `/develop` is a suggestion. The `checks` column in the scope says how much checking a feature warrants (`none`, `verify`, `verify+test`, `verify+test+review`) and you override it per feature. `done` is yours to declare. A skipped step is recorded as skipped, never quietly dropped.

## What gets written, and where

| Artefact | Path | Owner |
|---|---|---|
| Scope | `docs/scope/scope.md` | scope |
| Specs | `docs/specs/NNNN-slug.md` | architect |
| Context files | `AGENTS.md`, plus a thin `CLAUDE.md` pointer | audit, kept current by sync |
| Review findings | `docs/reviews/` | check |
| Tests | your test dirs | test |
| App code | your source tree | develop |
| Human docs | PR body, CHANGELOG.md, `docs/releases/`, `docs/postmortems/` | document |

Ownership is fixed because that is what stops the files turning to mush: only `architect` writes spec content, only `develop` moves the built status along, only `sync` edits `AGENTS.md` after the fact.

## The lifecycle a spec walks

`proposed` (decided, not built) -> `in progress` -> `accepted` (built and verified). An overturned decision is never edited: a new spec is written and the old one becomes `superseded`, pointing at its replacement. `assumed` is the honest state for a decision that got built before it was decided, and it stays visible until `/architect` ratifies it.

## More

- **[docs/why-this-fork.md](docs/why-this-fork.md)**: the four design decisions, and why each one was made.
- **[docs/workflow-guide.md](docs/workflow-guide.md)**: how the pieces fit, and who owns what.
- **[docs/conventions.md](docs/conventions.md)**: how to write a skill in this repo. Run `npm run check` before committing.
