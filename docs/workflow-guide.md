# How the workflow works

## The shape

Ten skills. Each one owns a phase of the work and one artefact, and each is a single file you can read in a minute. Run only the ones a change needs.

The point of splitting by phase is not ceremony, it is ownership. When one skill owns the plan and a different skill owns the decision, neither can quietly rewrite the other, so the files stay trustworthy over months. A single all purpose prompt has no such boundary.

```
idea -> /scope -> /audit -> /architect -> /develop -> /check verify -> /test -> /check review -> /document -> /sync
```

`/debug` runs whenever something breaks. `/standup` runs whenever you need to remember where you were.

## The four kinds of file

**`AGENTS.md`** describes how the project actually works: stack, commands, conventions, traps. `/audit` writes it from the real code, every other skill reads it, `/sync` keeps it current. It nests, so a folder that follows different rules carries its own, and a skill working there reads the nearest one.

**`docs/scope/scope.md`** is the ordered plan: one row per feature, one line of intent, one `Done when`, one `checks` value. `/scope` writes it, `/develop` moves a feature to `active`, `/sync` proposes `done`, and you decide.

**`docs/specs/NNNN-slug.md`** is one decision, written down. A status line, the decision, numbered requirements, the design, the build plan, and any open questions. This is the contract every later step traces back to.

**`design.md`** holds art direction the first time a feature has a screen. The real values live in the project's CSS; this file points at them, so a colour is never written twice.

## The gate, which is the only enforced rule

Before `/develop` writes code, it lists every value the feature must produce and asks where each one comes from. Named source means build. Unnamed source means a decision is owed, and there are three ways out:

1. Stop and run `/architect`. The normal answer.
2. Build anyway, and write an `assumed` spec recording what you invented and who authorized it. The feature stays flagged until `/architect` ratifies it. The flag never blocks `done`, it just refuses to be forgotten.
3. Build something else.

This exists because of a specific failure mode. An agent that reaches an unmade decision does not stop, it invents one, and the invention ends up in a diff where nobody looks for it. A spec at least puts it where the next person trips over it.

## What is a suggestion, and what is not

Everything after `/develop` is a suggestion: `/check verify`, `/test`, `/check review`, `/document`. The `checks` column on the feature's row says what that feature warrants, and you override it per feature. `done` is yours to declare, never a status a skill withholds.

The one thing the workflow asks at every level is that a load bearing decision is written down. Even that is flagged rather than enforced: an `assumed` spec is visible debt, not a blocked door.

## One requirement, followed end to end

`/architect` numbers a requirement `AC1` and writes it so a test could fail it. Every task in the build plan names the `AC` numbers it serves. `/develop` self checks against the same numbers and reports which it could not test. `/check verify` walks them against the running app. `/test` names them in test titles. `/document` lists which ones the change proves.

So a requirement can be traced from the decision, to the code that satisfies it, to the proof it works, to the test that keeps it working. Nothing is marked done that was never measured.

## Who may write what

| Artefact | Written by | Read by | Changed by |
|---|---|---|---|
| `AGENTS.md` and the `CLAUDE.md` pointer | audit | every skill | sync |
| `docs/scope/scope.md` | scope | architect, develop | develop advances, sync reconciles |
| `docs/specs/` | architect, plus the `assumed` stub develop may create | develop | develop moves the status line, architect owns content, sync flags staleness |
| `docs/reviews/` | check | document | nobody |
| `design.md` | develop | develop, check | develop |

Two rules keep this clean. Only `architect` writes the content of a decision, and only `architect` clears an `assumed` mark. Only `develop` moves the built status along, and the one spec it may create is an `assumed` stub.

## A new project, in order

1. `/scope` the idea. It asks three questions and writes the ordered plan.
2. `/architect` the stack. It is a real decision, so it gets a spec.
3. Scaffold from that spec.
4. `/audit` to seed `AGENTS.md` from the project that now exists, not from an empty folder.
5. The feature loop, one feature at a time.

## Picking work back up

Run `/standup`. It reads git and the scope and prints one screen: what moved, what is blocked, which specs owe a decision, and the one command to run next. It writes nothing, so it is always safe.
