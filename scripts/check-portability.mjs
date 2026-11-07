#!/usr/bin/env node
// Portability / convention guard for the skill suite.
// Run: node scripts/check-portability.mjs   (exit 1 on any violation)
//
// Enforces the cross-tool conventions we standardized so they don't drift:
//  1. Every skill declares `allowed-tools` in frontmatter.
//  2. No skill hardcodes a Claude-only model alias as a spawn directive
//     (`model: "haiku|sonnet|opus|fable"`) — use role words instead.
//     Convention: spawn instructions SET the subagent model explicitly as an
//     action ("set the model explicitly; do not inherit the session model"),
//     phrased in role words (a fast, low-cost tier / a strong model) with the
//     per-tool alias only as an unquoted example — subagents otherwise inherit
//     the (often expensive) main-session model.
//  3. No skill names THE subagent tool in prose ("the Agent tool",
//     "spawn an Agent", "the Task tool") — stay capability-first.
//  4. No non-git shell glue that breaks on PowerShell in a SKILL body
//     (`>/dev/null`, `&& BASE=`, `|| BASE=`) — express base-branch
//     selection as prose (git commands themselves are fine).
//  5. SKILL.md and bundled prompt assets stay within byte budgets — the
//     SKILL body loads into the main context on every invocation, and the
//     prompt assets load into subagent contexts when used.
//  6. Frontmatter `description` stays under 400 characters — every installed
//     skill's description loads into every session.
//  7. Every skill ships its OpenAI Codex adapter (`agents/openai.yaml`)
//     with the `interface:` fields present.
//  8. `allowed-tools` names the subagent tool `Agent`, not the legacy `Task`.
//  9. A marked contract block duplicated across skills stays byte-identical.
// 10. No em or en dash in any instruction file or `description` (the skills teach
//     the no-dash rule, so their own prose follows it).
// 11. No hyphen in prose. Compounds become simple words (read only, not read-only).
//     Code, paths, flags, ALL CAPS keywords, and the parsed artifact literals
//     (in-progress, gap-fill, whole-repo, Follow-up, pre-flight) keep theirs.
//
// Budgets (rule 5) are also reported as utilization on every run, and anything
// above WARN_AT is called out while it is still passing. See BUDGET POLICY below.
//
// Every `.md` under skills/ obeys every rule. The old `templates/` exemption
// existed for five bundled brand design systems; those are gone, and the four
// document templates left are literally the prose the skill emits, so they must
// follow the same style rules as everything else.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS_DIR = new URL('../skills/', import.meta.url).pathname;
const violations = [];
const warnings = []; // over WARN_AT but still under budget — visible, not fatal
const sizes = []; // { rel, words, bytes } per .md file, for the word-count report

// Rule 5 budgets. Default is the ceiling for a lean phase skill; overrides
// are grandfathered exceptions — ratchet them DOWN as files shrink, never up.
//
// BUDGET POLICY. A budget is a target with room to work in, not a high-water
// mark. Every ceiling below is set roughly WARN_AT above the file's real size,
// so a normal edit lands green and only genuine growth trips it. Fitting a
// ceiling to the current byte count (what these used to be: four groups sat at
// 98-99.9%, one with 54 bytes to spare) makes the guard fire on every edit, and
// the only way past a guard that always fires is to raise it — which is how a
// budget stops meaning anything. When a path breaches, shrink the files. Raise
// a ceiling only when the path genuinely needs to carry more, and say why.
//
// Utilization is printed on every run, and anything above WARN_AT is called out
// before it breaks, so creep is visible while it is still cheap to fix.
const WARN_AT = 0.9;
const SKILL_BYTE_BUDGET = 32 * 1024;
const SKILL_BYTE_OVERRIDES = {};
const SUPPORT_MD_BYTE_BUDGET = 24 * 1024;
const SUPPORT_MD_OVERRIDES = {}; // one file per skill: every skill is its SKILL.md, nothing to override
const DESCRIPTION_CHAR_CAP = 400;
// Hot path budgets lived here while a run could load a mode file behind a router.
// With one file per skill, a skill's own SKILL.md budget is the whole load, so a
// second aggregate budget models nothing. Deleted with the mode files.

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith('.md')) check(p);
  }
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

// Rule 11 helpers. Prose carries no hyphens; code does. Mask every exempt region
// with spaces (never delete, so byte offsets still map to line numbers), then any
// hyphenated word left standing is prose and must be rewritten into simple words.
const MASK = (s) => ' '.repeat(s.length);
function proseOnly(text) {
  return text
    .replace(/```[\s\S]*?```/g, MASK)      // fenced code blocks
    .replace(/`[^`\n]+`/g, MASK)           // inline code spans
    .replace(/<!--[\s\S]*?-->/g, MASK)     // html comments (contract markers)
    .replace(/\]\([^)]*\)/g, MASK)         // markdown link targets
    .replace(/https?:\/\/\S+/g, MASK)      // bare urls
    // Frontmatter keys are defined by the Agent Skills spec (`allowed-tools`), so
    // only the description value is prose. Mask the keys, keep the description.
    .replace(/^---\n[\s\S]*?\n---/m, (fm) =>
      fm.split('\n').map((l) => (/^description:/.test(l) ? l : MASK(l))).join('\n')
    );
}
// Named things the skills MATCH ON: values they write into artifacts, phase names,
// and section headings. Renaming one is a migration across skills, not a copy edit,
// so these keep their hyphens everywhere, backticked or not.
//   in-progress, gap-fill, whole-repo  values and phase names other skills read
//   Follow-up                          a spec section heading
//   pre-flight                         the named phase every skill runs before it acts
const PARSED_LITERALS = new Set([
  'in-progress', 'gap-fill', 'whole-repo', 'Follow-up', 'follow-up', 'pre-flight', 'Pre-flight',
]);
const isExemptTerm = (w) => /^[A-Z0-9-]+$/.test(w) || PARSED_LITERALS.has(w);

function check(path) {
  const rel = path.slice(SKILLS_DIR.length);
  const text = readFileSync(path, 'utf8');
  const isSkillMd = rel.endsWith('/SKILL.md');

  // Word-count report data (rule 5 companion): track every .md so a size
  // regression on a hot file is visible at a glance, not just on budget breach.
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  sizes.push({ rel, words, bytes: Buffer.byteLength(text, 'utf8') });

  // Rule 1 — allowed-tools on every SKILL.md
  if (isSkillMd && !/^allowed-tools:/m.test(frontmatter(text))) {
    violations.push(`${rel}: missing \`allowed-tools\` in frontmatter`);
  }

  // Rule 8 — the subagent tool is `Agent`. Claude Code renamed `Task` to `Agent`
  // in 2.1.63 and keeps `Task` only as a back-compat alias; declare the real name.
  if (isSkillMd) {
    const at = frontmatter(text).match(/^allowed-tools:\s*(.*)$/m);
    if (at && /\bTask\b/.test(at[1])) {
      violations.push(`${rel}: allowed-tools declares \`Task\` — the subagent tool is now \`Agent\` (Task is a legacy alias)`);
    }
  }

  if (isSkillMd) {
    const skill = rel.split('/')[0];

    // Rule 5 — SKILL.md byte budget
    const budget = SKILL_BYTE_OVERRIDES[skill] ?? SKILL_BYTE_BUDGET;
    const bytes = Buffer.byteLength(text, 'utf8');
    if (bytes > budget) {
      violations.push(`${rel}: ${bytes} bytes exceeds its budget of ${budget} — condense or split before it lands`);
    } else if (bytes / budget > WARN_AT) {
      warnings.push(`${rel}: ${bytes}/${budget} bytes (${(100 * bytes / budget).toFixed(1)}% of budget)`);
    }

    // Rule 6 — description length cap
    const desc = frontmatter(text).match(/^description:\s*"([\s\S]*?)"\s*$/m);
    if (desc && desc[1].length > DESCRIPTION_CHAR_CAP) {
      violations.push(`${rel}: description is ${desc[1].length} chars (cap ${DESCRIPTION_CHAR_CAP}) — it loads into every session`);
    } else if (desc && desc[1].length / DESCRIPTION_CHAR_CAP > WARN_AT) {
      warnings.push(`${rel}: description is ${desc[1].length}/${DESCRIPTION_CHAR_CAP} chars — trim it, it loads into every session`);
    }
    // Rule 10 for the description too. The per-line scan below skips frontmatter,
    // and the description is the most-loaded prose in the suite.
    if (desc && /[—–]/.test(desc[1])) {
      violations.push(`${rel}: description contains an em or en dash — it loads into every session and must obey the no-dash rule`);
    }
  } else {
    // Rule 5 — bundled prompt/guide byte budget
    const budget = SUPPORT_MD_OVERRIDES[rel] ?? SUPPORT_MD_BYTE_BUDGET;
    const bytes = Buffer.byteLength(text, 'utf8');
    if (bytes > budget) {
      violations.push(`${rel}: ${bytes} bytes exceeds its support-file budget of ${budget} — condense or split before it lands`);
    } else if (bytes / budget > WARN_AT) {
      warnings.push(`${rel}: ${bytes}/${budget} bytes (${(100 * bytes / budget).toFixed(1)}% of support-file budget)`);
    }
  }

  // Rule 11 — no hyphen in prose. Code, paths, flags, ALL CAPS keywords, and the
  // parsed artifact literals keep theirs; ordinary compounds become simple words.
  {
    const masked = proseOnly(text);
    const seen = new Set();
    for (const m of masked.matchAll(/[A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+/g)) {
      if (isExemptTerm(m[0])) continue;
      const line = masked.slice(0, m.index).split('\n').length;
      const key = `${line}:${m[0]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      violations.push(`${rel}:${line}: hyphen in prose \`${m[0]}\` — write it as simple words (code, paths, and flags keep theirs)`);
    }
  }

  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const n = i + 1;
    const fm = isSkillMd && i < 6; // rough frontmatter guard
    if (fm) return;

    // Rule 2 — no hardcoded model-alias spawn directive
    if (/model:\s*"(haiku|sonnet|opus|fable)"/.test(line)) {
      violations.push(`${rel}:${n}: hardcoded model alias — use role words ("a fast, low-cost model" / "a strong model")`);
    }
    // Rule 3 — no tool-naming in prose
    if (/\bthe [`"]?(Agent|Task)[`"]? tool\b/i.test(line) || /spawn an [`"]?Agent\b/i.test(line)) {
      violations.push(`${rel}:${n}: names the subagent tool in prose — stay capability-first ("spawn a subagent")`);
    }
    // Rule 4 — no PowerShell-breaking shell glue in SKILL bodies
    if (isSkillMd && (/>\/dev\/null/.test(line) || /&&\s*BASE=/.test(line) || /\|\|\s*BASE=/.test(line))) {
      violations.push(`${rel}:${n}: non-portable shell glue (\`>/dev/null\`/\`&& BASE=\`) — express base-branch selection as prose`);
    }
    // Rule 10 — the corpus obeys the no-dash rule it teaches. Every skill tells the
    // model to emit no em or en dash; an instruction file full of them is the wrong
    // example, and the model writes in the register of its context. Plain hyphens in
    // compound words and flags are fine, only U+2014 and U+2013 are banned.
    if (/[—–]/.test(line)) {
      violations.push(`${rel}:${n}: contains an em or en dash — the skills mandate no dashes, so their own prose carries none (use a comma, a colon, or parentheses)`);
    }
  });
}

walk(SKILLS_DIR.replace(/\/$/, ''));

// Rule 9 — shared contract blocks stay byte-identical across the skills that
// carry them. Skills install as independent folders, so a rule two skills must
// both obey cannot live in one shared file; it is duplicated on purpose and
// pinned here instead. At least two skills must carry each block.
const CONTRACT_BLOCK = /<!-- ([A-Z-]+):START[^>]*-->([\s\S]*?)<!-- \1:END -->/g;
const contracts = new Map(); // name -> [{ rel, body }]
for (const s of sizes) {
  const text = readFileSync(join(SKILLS_DIR, s.rel), 'utf8');
  for (const [, name, body] of text.matchAll(CONTRACT_BLOCK)) {
    if (!contracts.has(name)) contracts.set(name, []);
    contracts.get(name).push({ rel: s.rel, body: body.trim() });
  }
}
for (const [name, copies] of contracts) {
  if (copies.length < 2) {
    violations.push(`${copies[0].rel}: contract block \`${name}\` appears only once — inline it or add its counterpart`);
    continue;
  }
  const [first, ...rest] = copies;
  for (const other of rest) {
    if (other.body !== first.body) {
      violations.push(
        `contract block \`${name}\` has drifted: ${first.rel} and ${other.rel} differ — they must stay byte-identical`
      );
    }
  }
}

// Rule 7 — every skill ships its OpenAI Codex adapter
for (const entry of readdirSync(SKILLS_DIR)) {
  const dir = join(SKILLS_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  const adapter = join(dir, 'agents', 'openai.yaml');
  if (!existsSync(adapter)) {
    violations.push(`${entry}: missing agents/openai.yaml (OpenAI Codex adapter)`);
  } else {
    const y = readFileSync(adapter, 'utf8');
    for (const field of ['interface:', 'display_name:', 'short_description:', 'default_prompt:']) {
      if (!y.includes(field)) violations.push(`${entry}/agents/openai.yaml: missing \`${field.replace(':', '')}\` field`);
    }
  }
}

const failed = violations.length > 0;
if (failed) {
  console.error(`Portability check FAILED (${violations.length}):\n` + violations.map(v => '  - ' + v).join('\n'));
  // Set the code and let node exit on its own once stdio has drained.
  // `process.exit()` tears the process down before a large buffered write to a
  // pipe has flushed, which silently truncated this list under `| grep` and in CI.
  process.exitCode = 1;
}

if (!failed) {
// Word-count report — the heaviest instruction files (templates excluded; they
// are reference data), so a creeping size regression is visible before it breaks
// a budget. Loading cost tracks words as much as bytes.
const report = sizes
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 15);
const pad = Math.max(...report.map(s => s.rel.length));
console.log('\nHeaviest instruction files (words · bytes):');
for (const s of report) {
  console.log(`  ${s.rel.padEnd(pad)}  ${String(s.words).padStart(5)} w · ${String(s.bytes).padStart(6)} b`);
}

if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}) — under budget, over ${100 * WARN_AT}%, fix before they fail:`);
  for (const w of warnings) console.log('  - ' + w);
}

console.log('\nPortability check passed — all skills follow the cross-tool conventions.');
}
