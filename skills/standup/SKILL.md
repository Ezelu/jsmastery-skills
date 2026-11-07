---
name: standup
allowed-tools: Bash, Read, Grep, Glob
description: "Run /standup to print one screen on where the work stands: what moved in git over the last day, which scope features are in-progress or blocked, and which specs still owe a decision. Read only, writes nothing. Run it at the start of a session to pick work up without rereading the repo."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Answers "where was I" in one screen, from git and the files the workflow already writes, so no chat history has to carry it. It reports and stops: no file written, nothing edited, no subagent started. The durable record stays in `docs/scope/` and `docs/specs/`; this reads it and compresses it.

Run it at the start of a session, before `/develop`, or when you pick up a branch someone else left behind. It is the cheap alternative to reading the whole repo again.

## Execution

### Step 1: Locate the artifact base

Follow whichever exists: `docs/scope/` by default, or `.workflow/scope/` when `docs/` is a published docs site (the same base every other skill reads). If neither exists, print one line saying there is no scope yet, recommend `/scope`, and stop.

### Step 2: Read the three sources

Read them in one pass and keep each result small:

- **Git**: the current branch, how it sits against the base branch (ahead, behind), and the recent subjects from `git log --since=1.day --oneline`. Commit subjects only, never diffs. If that window comes back empty, widen it to the last few commits and say which window you used.
- **Scope**: the At a glance table, with every row and its status. Open a feature section only when its row is `in-progress` or carries a blocker note.
- **Specs**: the status line of each file in `docs/specs/`, nothing more. Collect the ones that are `Proposed` (decided, not built) and the ones that are `Assumed` (built on a decision nobody made yet).

### Step 3: Print the readout

One screen, house voice, in this order. Omit any section that has nothing in it, and never add a section to look complete.

- **Headline**: one line, what moved and the single state that matters most.
- **Moved**: one line per feature whose status changed, with its commit count. Collapse pure version bumps and docs touches into one line.
- **Blocked**: only when something is. The feature, what it waits on, and who owes it.
- **Needs a decision**: each `Proposed` or `Assumed` spec on one line, with the command that clears it (`/architect <feature>`), since an unratified decision is debt that outlives the session.
- **Next**: exactly one command to run, with a one line why.

Lead with the essentials and point at the file that holds the detail. Do not reprint the scope table or the spec bodies.

### Step 4: Stop

Print nothing past the readout. Do not offer to advance the scope, fix a blocker, or write a spec. If the engineer wants a change made, that is `/develop`, `/architect`, or `/sync`, not this skill.
