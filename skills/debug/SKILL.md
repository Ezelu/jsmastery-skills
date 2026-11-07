---
name: debug
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
description: "Run /debug when behavior is wrong or a test fails for an unclear reason. It proves a root cause before changing anything: reproduce, narrow, one hypothesis at a time, minimal fix, then a regression test for /test. No features, no opportunistic refactors. A fix you cannot explain is a bug you have not caught."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Runs an investigation, not a guess. Evidence over intuition, one hypothesis at a time, so every result means something. Resist patching what you can see, the null and the crash, before you understand why it is there.

The loop: reproduce, narrow, hypothesize, prove, fix, protect.

## Writes

The minimal code fix. A regression test, inline if that is the fastest proof, otherwise handed to `/test`. Nothing else: no features, no unrelated cleanups riding along, no spec rewriting.

## Rules

- **No fix without a cause.** If you cannot explain why the change works, you have moved the symptom.
- **One hypothesis at a time.** Shotgun edits destroy the information you went to the trouble of getting.
- **One thing per run.** A bug fix that also reorganizes a module cannot be reviewed and cannot be reverted cleanly.
- **A wrong decision is not a coding mistake.** If the bug is the design, say so and point at `/architect` instead of papering over it in code.

## Steps

1. **Capture the symptom.** Observed behavior, expected behavior, and the exact steps or inputs that trigger it. If you cannot get all three, ask once. A bug you cannot reproduce on demand is a bug you cannot prove you fixed.
2. **Reproduce.** Find the deterministic trigger: a command, a request, a failing test. If it is intermittent, find what makes it deterministic before going further.
3. **Narrow.** Binary search the path where good input becomes bad output. For a regression, bisect the history. Read the actual values at the boundary instead of assuming them.
4. **Hypothesize, once.** One specific falsifiable cause. A symptom is not a cause: "the value is null here" describes where it broke, not why.
5. **Prove it.** The smallest experiment that confirms or refutes. Refuted means discard it and use what you learned. Confirmed means you have the cause.
6. **Fix at the root,** minimally, in the project's own style.
7. **Protect it.** Run the reproduction again, run the surrounding suite, add the failing test that now passes. Then grep for the same assumption elsewhere, since the same cause usually hides twice.

## Report

Headline: the proven cause, and the fix in one line.
Next: `/test` to keep the regression test.
Heads up: the same cause found elsewhere, or a flawed decision that belongs to `/architect`.
Pointer: the reproduction and the files touched.
