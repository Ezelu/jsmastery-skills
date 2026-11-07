---
name: scope
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, AskUserQuestion
description: "Run /scope to write and keep the plan: what to build, in what order, and how much checking each feature gets, in one file at docs/scope/scope.md. Run it bare to reconcile after shipping. It decides WHAT to build, never how; /architect decides how."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Writes the plan and keeps it true as things ship. Coarse on purpose: one row per feature, one line of intent, one line of `Done when`. Build tasks belong in the spec, never here, or the plan turns into a second todo list that goes stale.

## Writes

`docs/scope/scope.md`, and nothing else. Shape:

- A legend line, then a table: `# | feature | status | checks`
- One section per feature: `### N. Name`, one line of intent, one `Done when:` line, checkboxes for anything worth tracking
- Statuses: `planned`, `active`, `blocked`, `done`, `dropped`

Status ownership: this skill writes `planned` and `dropped`. `/develop` sets `active`. `/sync` proposes `done` from evidence and the engineer confirms. Never delete a row: a cut feature becomes `dropped`, so the history survives.

The `checks` column is the whole of the rigor dial: `none`, `verify`, `verify+test`, or `verify+test+review`. Default `verify+test`. It is a suggestion the engineer overrides per feature, never a lock.

## Rules

- **Never name a tool.** No framework, database, host, provider, or library. A feature that implies one gets `needs spec` in its line and is settled by `/architect`.
- **Coarse.** A row that needs three sentences is two features.
- **Ask once, up front.** At most three questions in one batch, each with a recommended option and a one line why. Never a neutral menu.
- **Edit in place.** No dated copies, no rewrites. Reconcile cell by cell.

## Steps

1. Look for `docs/scope/scope.md`.
2. **File exists, no argument** means reconcile. Read the rows, read what the code and `docs/specs/` now show, fix the drift, then queue the next slice. Report and stop.
3. **No file, and a product sized idea** means plan:
   - Ask the three questions that change the plan: who it is for, what the first usable version must do, what can wait.
   - Split into the smallest ordered features where each one ships something a person can see or do.
   - Give each an observable `Done when` and a `checks` value from its risk.
   - Write the file, then stop. Do not design anything yet.
4. **File exists, argument names one feature** means add one row in order. Do not replan the rest.
5. **Nothing to go on at all** means ask what is being built. One question, then wait.

## Report

Headline: how many features, and what the next one is.
Next: the one command to run.
Pointer: `docs/scope/scope.md`.
