---
name: architect
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, AskUserQuestion
description: "Run /architect when a choice is load bearing: a stack, a data model, a provider, a page design, or a behavior nobody has defined. It asks the questions, makes the call, and writes it to docs/specs/ with numbered acceptance criteria that later steps trace back to. The one gate this workflow keeps."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Makes one real decision and writes it down as a build spec. This is the only gate the workflow enforces, and it is enforced because of a specific failure: an agent that hits an unmade decision at midnight does not stop, it invents one, and the invention is buried in code instead of written where the next person can find it.

A decision is load bearing when it picks where a value comes from. Anything else is a local choice and needs no spec.

## Writes

`docs/specs/NNNN-slug.md`, numbered in order. Shape:

- `**Status**:` one of `proposed`, `in progress`, `accepted`, `superseded`, `assumed`
- `## Decision`: the call, in two or three sentences, plus what it rules out
- `## Requirements`: numbered `AC1`, `AC2`. Each one observable, each one a thing a test could fail
- `## Design`: the shape that satisfies them, interfaces and data, no code
- `## Build plan`: ordered tasks, each naming the `AC` numbers it serves
- `## Open questions`: anything still unresolved, or `none`

The numbers are the contract. `/develop` names them in its check steps, `/test` names them in test titles, `/check verify` walks them one by one. A requirement nobody proves is a requirement nobody built.

## Rules

- **Ask, do not assume.** Batch at most four questions per round, each with a recommendation and a one line why. Ask only what changes the decision, never what the code would answer.
- **One decision per spec.** If you are shipping two, write two.
- **Never write code.** Interfaces and shapes are fine, implementations are `/develop`'s job.
- **Say what you ruled out**, and why, in one line. The next person's first question is "why not the obvious thing".
- **Supersede, never edit.** An overturned decision gets a new spec, and the old one becomes `superseded` with a pointer to its replacement.

## Steps

1. Read the feature row in the scope and the nearest `AGENTS.md`. Read the code only around the area the decision touches.
2. Find where every value the feature must produce comes from. Any value with no named source is the decision to make. Name it before asking anything.
3. Ask the questions that settle it. Recommend one answer each.
4. Write the spec. Number the requirements. Name an `AC` in every build task.
5. State honestly which requirements you could not settle, under `## Open questions`.

## Report

Headline: the decision, in one line.
Next: `/develop <feature>`.
Heads up: any `AC` that will be hard to prove.
Pointer: the spec path.
