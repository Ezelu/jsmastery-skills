---
name: develop
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, AskUserQuestion
description: "Run /develop to build a feature from its spec: reads the acceptance criteria and the nearest AGENTS.md, builds, self checks against the numbered criteria, and moves the scope and spec status. If a decision is owed and unrecorded it stops and routes to /architect, or records the assumption as an assumed spec."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Builds one feature from its spec, then proves it against the same numbered criteria the spec was written with. It reads the criteria, not the whole `docs/` tree: its own scope row, its own spec, the nearest `AGENTS.md`, and the code the change touches.

## Writes

- App code, following the conventions in `AGENTS.md`
- The scope row: status to `active`, task boxes ticked as they land
- The spec `**Status**:` line only, `proposed` to `in progress`, then `in progress` to `accepted` once the criteria are proven. Never the spec's content.

## Step 0: the gate, before any code

List every value the feature must produce, compute, or show. For each one, ask: does the spec name where it comes from? A named source means build. No named source means a decision is owed, and there are three answers:

- **Stop and route** to `/architect`. The default.
- **Build anyway, and record it**: write a small spec marked `Status: assumed` that names the decision you are inventing, why you chose it, and who authorized the shortcut. The feature stays flagged as owing ratification until `/architect` settles it. This is the only spec this skill may create.
- **Skip it** and build something else. Say which.

Never quietly invent a provider, a data model, or a page design. That is the failure this workflow exists to prevent, and it is invisible in a diff.

## Steps

1. Run the gate above. Report what it found before touching code.
2. Read the spec's requirements, design, and build plan. Read the code around the change.
3. Build in the spec's task order. Keep the project's commands working as you go, not at the end.
4. Self check every `AC`, one at a time, by running the thing. Record what you ran and what you saw. A criterion you did not test is not met, it is untested, and say so in those words.
5. Tick the scope, move the spec status, name the files you touched.
6. Stop. Do not refactor past the spec, do not add a feature nobody asked for.

## Report

Headline: what was built, and how many criteria are proven against how many total.
Next: the one check to run (`/check verify`, `/test`, or both, per the feature's `checks` value).
Heads up: an `assumed` spec, an untested criterion, or a decision that belongs upstream.
Pointer: the spec and the changed files.
