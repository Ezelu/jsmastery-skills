# Running these skills without a paid plan

Every skill here is a folder with a `SKILL.md`, and `SKILL.md` is a cross agent format. The instructions do not know which agent reads them, so the same folder runs on any Agent Skills client. That matters if you are on a free tier: you can use this workflow without a Claude Pro or ChatGPT Plus subscription.

Pick the client you have, not the client with the best benchmarks. Then install the skills into that client's skills directory.

## Where each client reads from

| Client | Project directory | Personal directory |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Gemini CLI | `.gemini/skills/` or `.agents/skills/` | `~/.gemini/skills/` or `~/.agents/skills/` |
| Cursor and other clients | `.agents/skills/` | `~/.agents/skills/` |

Project skills win over personal ones when two share a name, and they travel with the repo, so the whole team gets the same workflow.

## Gemini CLI, the free path

Gemini CLI has the most useful free tier of the major terminal agents: on a personal Google account it is a thousand model requests a day at sixty a minute, no card and no expiry date. It reads `SKILL.md` folders natively, so nothing here needs changing.

```bash
npm install --global @google/gemini-cli
gemini                                                    # sign in with a Google account
gemini skills install ./skills --scope workspace          # from a clone of this repo
gemini                                                    # then run /skills list to confirm
```

`--scope workspace` installs into `.gemini/skills/` so the workflow travels with the project. Drop it to install for your account instead, into `~/.gemini/skills/`.

## Any client, via npx

The repo's own installer works across clients, and you can point it at a fork:

```bash
npx skills@latest add Ezelu/jsmastery-skills                          # generic .agents/skills
npx skills@latest add Ezelu/jsmastery-skills -a claude-code           # into .claude/skills
```

## Two things the free tier changes about how you run this

**Only load what you need.** Every skill is budgeted, and each one loads in full on its path. Running `/standup` or a bare `/scope` costs a fraction of a full design pass. On a metered tier, that discipline is the whole game, which is why the skills are lean and why `npm run check` refuses edits that quietly fatten them.

**Reach for a strong model only where it pays.** The design pass and the review deserve the good model. Exploration, searching, and file reads do not: the skills already tell the agent to pin a fast, low cost tier for those and set it explicitly, so a subagent does not inherit the expensive session model.

## What the free tier does not change

The state lives in files, not in a chat, so `/clear` costs you nothing and work survives a session that ran out of quota mid feature. That is true of every client in the table above, and it is the reason the workflow is portable in the first place.
