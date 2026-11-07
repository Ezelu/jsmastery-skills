# Project: Engineering Workflow Skills

A fork of JavaScript Mastery's Agent Skills suite (MIT), cut to one file per skill. A phase based engineering workflow with no mandated playbook: you run whichever skills a change needs, in whatever order fits. The reasoning behind each cut is in `docs/why-this-fork.md`.

## Conventions every skill follows

- **One file per skill.** No mode files, no bundled guides, no subagent prompts. A phase of the work fits on one screen. If a skill needs more, the skill is doing too much.
- **No subagents.** No `allowed-tools` line names the subagent tool. Everything runs on the main thread, because a metered tier charges a request for every spawn.
- **The engineer decides; the AI recommends.** Any check or critique is offered, never run on the engineer's behalf. A finding is surfaced, never silently fixed.
- **Suggestions, never gates.** Every step after `/develop` is suggested by the feature's `checks` value and freely skippable. `done` is the engineer's to declare. A skipped step is recorded as skipped.
- **One enforced rule:** a load bearing decision is written down before it is built, as a spec in `docs/specs/`. Building without it is allowed, but records an `assumed` spec that stays flagged.
- **Every user facing question carries exactly one recommended option**, with a one line why. Never a neutral menu, never a silent decision.
- **Say which review ran.** `review` is a self review here, and its output says so. A review that oversells itself is worse than none.
- **Keep skills lean.** A skill loads in full on its path every run, so every line is a recurring cost. Cut lines that do not change the agent's behavior. Full guidance: [`docs/conventions.md`](docs/conventions.md). Run `npm run check` before committing skill edits.

## Layout

- Skills: `skills/<name>/SKILL.md`, plus `agents/openai.yaml` as Codex interface metadata only
- Docs: `docs/workflow-guide.md` (how the pieces fit, who owns what), `docs/why-this-fork.md` (what differs from upstream and why), `docs/clients.md` (running this without a paid plan), `docs/conventions.md` (how to write a skill here)
- Guard: `scripts/check-portability.mjs`, run by `npm run check` and by CI on every pull request

Consumers install with `npx skills add Ezelu/jsmastery-skills`, which lands the skills in their agent's skills directory.
