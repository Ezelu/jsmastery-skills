---
name: test
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
description: "Run /test to write the tests that keep a change working, named after the acceptance criteria they prove. Fails first, then passes. Uses the runner the project already has, or sets one up only when there is none. Never broadens the change to make a test easier to write."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Talk to the reader as `you`, warm and direct like a colleague, and present every step as a recommendation they may run or skip, never an order. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

Locks in the criteria that could break later. Not coverage for its own sake: a test earns its place by naming the requirement it proves, and a test that cannot fail is not a test.

## Writes

Test files, in whatever layout the project already uses. If there is no runner, say so and offer to set one up in one step, with the smallest runner that fits the stack.

## Rules

- **Name the criterion.** Every test title carries its `AC` number. A test that maps to no criterion needs a reason in its own title.
- **Fails first.** Write the test, watch it fail for the right reason, then make it pass. A test written after the code and never seen failing is unproven.
- **Assert behavior, not shape.** What a caller observes. Never a snapshot of markup unless the markup is the product.
- **One reason to fail.** A test with four assertions in four areas tells you almost nothing when it lights up.
- **Never change the product to fit the test.** If the test is hard to write, the design is the finding, so say so.

## Steps

1. Read the spec's requirements and `/develop`'s self check notes. The self check is the shortlist: anything proven by hand is a candidate for a lasting test.
2. Read the existing tests for style, helper names, and where they live. Match them.
3. Pick the criteria worth locking: the ones about data, permissions, money, time, and anything a future change would quietly break. Not every criterion needs one.
4. Write one test per criterion, run it, watch it fail for the reason you predicted, then make it pass.
5. Run the whole suite. A change that breaks an unrelated test is a finding, not something to patch here.

## Report

Headline: how many tests, which criteria they cover, suite pass or fail.
Next: `/check review` before the pull request.
Heads up: criteria left unlocked, or a flaky test.
Pointer: the test files.
