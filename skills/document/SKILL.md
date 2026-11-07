---
name: document
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
description: "Run /document to write the human text from the real diff: a pull request body, a changelog line, a release note, or a postmortem. It reads commits and code, never the chat that produced them, so the record survives the session. Writes only prose, never code."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Turns a diff into text a person can act on. The rule that makes it work: read the diff, the spec, and the review findings, never the conversation. Anything only the chat knows is not part of the change and does not belong in the record.

## Writes

One of these, whichever was asked for:

- **A pull request body** in the project's own template if one exists. Otherwise: what changed, why, which acceptance criteria it proves, what was not done, and how to check it by hand.
- **A changelog line** under the right heading, written for the person using the product, not the person who wrote the code
- **A release note** grouped by what a user notices, with anything breaking called out first
- **A postmortem** in `docs/postmortems/`: what happened, the timeline from evidence, the root cause, the fix, and the change that stops the repeat. No names attached to blame.

## Rules

- **The diff is the source of truth.** If it is not in the diff, the spec, or the review, it did not happen.
- **Lead with the effect.** What a reader can now do, or can no longer break. Not the file list.
- **Name what is missing.** Untested criteria, skipped steps, a known rough edge. A record that hides its gaps is a record nobody trusts twice.
- **Match the project's voice** from `AGENTS.md`, and the template if one exists. Never invent a new format.

## Steps

1. Get the change: commits since the base branch, then the diff, then the spec it serves, then `docs/reviews/`.
2. Ask which artefact is wanted if it is not obvious. One question, with a recommendation.
3. Write it from the evidence. Put the hand check steps last, in order, so nobody has to reason about how to try it.
4. Cut every sentence that repeats the diff.

## Report

Headline: what was written, and where it goes.
Heads up: unproven criteria or skipped checks, stated in the text rather than hidden.
Pointer: the file, or the text to paste.
