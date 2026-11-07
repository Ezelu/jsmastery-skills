---
name: check
allowed-tools: Bash, Read, Grep, Glob, Write
description: "Run /check verify to drive the real app and prove each acceptance criterion. Run /check review for a fresh read of the diff against a fixed checklist. Neither mode edits code: verify points at /debug, review reports findings ranked by severity into docs/reviews/. Say plainly in both that review is a self review, not an independent one."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Two jobs that people confuse. `verify` runs the real thing and watches it behave. `review` reads the diff cold and looks for what running it would not catch.

## The honest limit of `review`

An independent review means a model that did not write the code, on a different vendor, with no memory of the reasoning. **On a free tier that model is not reliably available**, so this skill does not pretend to it. It runs a fresh pass on the same model, with the conversation cleared and a fixed checklist, and it labels the output a self review.

A self review catches less than an independent one. It still catches a useful amount, because the checklist is external and the context is fresh. Say which one you ran, every time. A review that oversells itself is worse than no review, because it buys false confidence.

## Writes

`docs/reviews/NNNN-slug.md` in review mode. Nothing in verify mode: it reports.

## Steps: verify

1. Read the governing spec. List its `AC` numbers.
2. Start the app, or the service, using the commands in `AGENTS.md`. If it will not start, that is the finding; report it and stop.
3. Walk each criterion against the running thing. For each, record the action you took and what you observed. Pass, fail, or untested, and never guess a pass from reading code.
4. Any fail points at `/debug` with the reproduction you just performed. Do not fix it here.

## Steps: review

1. Get the diff: staged, or against the base branch. Read it in full before reading anything else.
2. Clear the context if the client allows it, then read the diff cold against the numbered criteria.
3. Work the checklist: unhandled failure paths, inputs at the boundary, a value whose source is unnamed, an authorization check on the server rather than the screen, a test that asserts nothing, code that contradicts `AGENTS.md`.
4. Rank each finding: `blocker`, `should fix`, `nitpick`. Give each one the file and line, what breaks, and the smallest fix. No finding without a way to see it.
5. Write the file. Report the count by rank.

## Rules

- **Never edit code.** Both modes report. An agent that fixes during review cannot be trusted to review its own fix.
- **No finding without evidence.** If you did not see it in the diff or in the running app, it is a question, not a finding.
- **Do not pad the list.** Three real findings beat eleven with eight nitpicks.

## Report

Headline: pass or fail on verify, finding counts on review, and which review it was.
Next: `/debug` for a failure, or fix the blockers and run it again.
Pointer: `docs/reviews/`.
