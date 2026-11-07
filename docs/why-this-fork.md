# What I changed from upstream, and why

The phase workflow is [JavaScript Mastery's skills suite](https://github.com/JavaScript-Mastery-Pro/skills), MIT licensed, forked. Nine phases, one file each, the state in files rather than in a chat. That design is the reason I use it, and it is not mine.

What follows is mine: four cuts, each one a decision with a reason I can defend. If you are reading this before an interview, these are the four things to ask me about.

## 1. One file per skill, and nothing behind it

Upstream splits a skill into a small router plus mode files, bundled guides, and separate agent prompts. A run loads the router, then one or two of the files behind it.

I deleted all of them. Every skill is now a single `SKILL.md`, and the heaviest is under 650 words.

**Why:** a mode file is a load you pay for on the path that does not use it, and every one of those files is a thing that can drift out of step with its router. The budget guard forced the question and the answer was that a phase of the work fits on one screen if you stop trying to cover every shape of every project. The cost is real and I will name it: my `develop` handles less variety than theirs, and on an unusual project I will be adding a paragraph that they already had.

## 2. No subagents

Upstream spawns a read only exploration subagent, a research subagent, and an independent reviewer. Every `allowed-tools` line here omits the subagent tool entirely, so none can be spawned even by accident.

**Why:** I run this on a metered free tier. A subagent costs an extra request and a copy of the context, and the thing it saves is main thread context I am not paying for in the same way. On a paid plan with a long design session, their split is the better engineering. On a thousand requests a day, it is a tax.

The honest cost: a long build fills the main context, so I lean harder on `/clear` between phases and on the spec being good enough to rebuild context from.

## 3. No second model review, and the review says so

Upstream's `/check review` runs a senior review on a model that did not write the code, on a different vendor, because a model reviewing its own output shares its blind spots. That is the right design.

I cannot run it for free, so this fork does not pretend to. `review` clears context, reads the diff cold against a fixed checklist, and **labels the output a self review in the artefact itself**. The checklist is external, which is where most of the value was anyway.

**Why it is written down rather than quietly downgraded:** a review that oversells itself is worse than no review, because it buys false confidence and you stop looking. Every report here says which review ran.

## 4. One column instead of four tiers

Upstream has four named workflow tiers (`Prototype`, `Alpha`, `Beta`, `GA`), a project default, and a per feature override.

This fork has a `checks` column on each scope row: `none`, `verify`, `verify+test`, or `verify+test+review`. Same information, no vocabulary to learn, and it is visibly per feature because it sits on the row.

**Why:** four named tiers to express a yes or no is a vocabulary tax paid on every run. The moment you need a name you also need the docs that explain the name, and the docs are load you never get back.

## What I kept, and why that matters more than what I cut

- **The phase split.** One skill owns one phase and one artefact. Fixed ownership is what stops the files rotting.
- **The one gate.** Every value the feature must produce needs a named source before the build. This is the single best idea in the suite: an agent that hits an unmade decision at midnight does not stop, it invents one, and the invention is buried in a diff instead of written where the next person can find it.
- **`assumed` as a real status.** Building before deciding is allowed, but it gets recorded, and it stays flagged. The flag never blocks `done`, which is what makes it honest rather than nagging.
- **Numbers as the contract.** `AC1`, `AC2`. The build plan names them, the tests name them, verify walks them. One requirement followed in a straight line from decision to proof.
- **State in files.** A chat that ends takes the reasoning with it. A spec does not.
