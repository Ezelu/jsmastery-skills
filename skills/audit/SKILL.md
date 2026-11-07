---
name: audit
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
description: "Run /audit to write the AGENTS.md files every other skill reads: the real stack, the real commands, the conventions this project actually follows, and the traps. Read the code, never guess. Run it once per project, and again when the shape of the project changes."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Writes the context files that stop every later step guessing. A skill that has to infer your test command invents it, and an invented command is a fake verification. This reads the project and records the truth, small enough that an agent actually reads it.

## Writes

`AGENTS.md` at the root, plus a nested `AGENTS.md` in any folder that genuinely follows different rules. A root `CLAUDE.md` containing one line that imports `AGENTS.md`, so there is one source and no copy to drift.

Shape, and no more than this:

- **Stack**: language, framework, database, test runner, package manager, with versions from the real manifest
- **Commands**: install, dev, build, test, lint, typecheck, exactly as the manifest defines them
- **Conventions**: how code in this repo is actually written, taken from the code, not from taste
- **Traps**: the things that break, the ordering that matters, the generated folder nobody should edit
- **Do not**: three or four hard rules, only ones a newcomer gets wrong

## Rules

- **Read before writing.** Every command comes from `package.json`, `pyproject.toml`, a Makefile, or a config file. If a command is not defined anywhere, say so instead of inventing one.
- **Short beats complete.** Every line loads in every session. Cut any line an agent would already do right.
- **Nested only when earned.** A nested file exists because that area differs, not for tidiness.
- **Never write aspirational rules.** If the code does not do it, it is not a convention.

## Steps

1. Find the manifests and the entry points. Read the scripts, not the whole tree.
2. Sample the source: two or three representative files per area, for naming, error handling, and test style.
3. Grep for the usual landmines: environment files, generated output, migrations, anything with a comment warning about it.
4. Write the root file. Then write a nested file only where you found a real difference.
5. Write the `CLAUDE.md` pointer.
6. Read it back once and cut a third of it.

## Report

Headline: how many context files, and the one command a stranger needs most.
Next: `/architect` for the first decision, or `/develop` if a spec already exists.
Pointer: `AGENTS.md`.
