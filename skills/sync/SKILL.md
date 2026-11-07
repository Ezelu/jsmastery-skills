---
name: sync
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
description: "Run /sync after a change lands to bring the written record back in line with the code: AGENTS.md, scope statuses, and spec statuses. It flags what it cannot decide, including a spec a later change quietly made stale and an assumed spec still owing ratification. Never rewrites a decision."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Keeps the record honest after the code moves. Files drift silently: a command changes, a convention dies, a feature ships and the row still says `active`. Drift is cheap to fix now and expensive to discover six weeks later, when an agent reads a stale `AGENTS.md` and follows it confidently.

## Writes

- `AGENTS.md`, in place: corrected commands, a convention that no longer holds, a trap discovered during the build. Facts only.
- `docs/scope/scope.md`: the status column, and task boxes the build finished. Propose `done`, do not declare it.
- The spec `**Status**:` line, only where the code contradicts it.

Never spec content, never a decision. A stale decision is flagged for `/architect`, not rewritten here.

## Rules

- **Verify against the code before editing.** A command in `AGENTS.md` is edited only after running it or reading the manifest that defines it.
- **Small, surgical edits.** Read the file again immediately before writing, and change the line you came for.
- **Flag over fix.** A spec that no longer matches the code, an `assumed` spec owing ratification, a scope row with no code and no spec. Surface them with a one line recommendation, let the engineer decide.
- **Never delete history.** A dropped feature stays in the table.

## Steps

1. Get the change: what landed since the last `sync`, from the diff or the merge commit.
2. Check `AGENTS.md` facts against the code: commands, paths, conventions, traps. Fix only what is wrong.
3. Walk the scope rows the change touches. Propose status changes, tick finished boxes, add a row for work that shipped with no row.
4. Walk the specs the change touches. Status corrections only, plus a flag for any spec the code has overtaken.
5. Report what you changed and what you only flagged.

## Report

Headline: what was reconciled, and how many items are flagged for a human.
Next: `/architect` for any flagged decision, `/scope` for the next slice.
Heads up: unratified `assumed` specs, stale specs, scope rows with no code.
Pointer: the files edited.
