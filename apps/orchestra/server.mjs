#!/usr/bin/env node
// Orchestra -- a localhost service that lists every agent in the
// Aisoldier ensemble AND shows each agent's contribution (how many times
// it was invoked, how many tokens it burned, how recently, and its share
// of total involvement). Zero dependencies (Node built-in http only).
//
// Agent definitions are read LIVE from .claude/agents/*.md. Contributions
// are read from data/contributions.jsonl (one JSON line per invocation,
// appended via log.mjs). Agents with zero invocations are flagged as
// candidates to drop -- the whole point is to see who earns their seat.
//
//   node apps/orchestra/server.mjs            # http://localhost:7777
//   PORT=8080 node apps/orchestra/server.mjs
//
// ASCII-only in user-facing text (studio discipline).

import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");
const AGENTS_DIR = join(REPO_ROOT, ".claude", "agents");
const LEDGER = join(HERE, "data", "contributions.jsonl");
const PORT = Number(process.env.PORT) || 7777;

// group: section the agent renders under. order: sort within section.
// type: ORCH | content | build | GATE | CRITIC | ship. role/writes add
// the doctrine context that is not in the .md frontmatter.
const META = {
  "3mpq-dispatcher": { group: "Route & plan", order: 0, type: "ORCH", role: "Routes the task to the minimal set of agents. Decides which verifiers run.", writes: "routing plan" },
  "3mpq-architect":  { group: "Route & plan", order: 1, type: "ORCH", role: "Compiles brief + tokens + registry into a section contract. Minimalism baked in: heading + body by default.", writes: "SECTION_CONTRACT.md" },
  "3mpq-prompter":   { group: "Route & plan", order: 2, type: "ORCH", role: "Composes every soldier prompt to force design-system-first reuse and injects the live constraint set.", writes: "soldier prompt" },
  "3mpq-researcher": { group: "Research & content", order: 0, type: "content", role: "Design research, trends, competitor analysis, creative direction.", writes: "research/*.md, CORRECTIONS.md" },
  "3mpq-economist":  { group: "Research & content", order: 1, type: "content", role: "Pricing, unit economics, breakeven, channel costs.", writes: "ECONOMICS.md, pricing-brief.md" },
  "3mpq-copywriter": { group: "Research & content", order: 2, type: "content", role: "Writes copy. BBC style, no AI cliches, no dashes. (Audited later by naturalist.)", writes: "content/copy.json" },
  "3mpq-soldier":    { group: "Build", order: 0, type: "build", role: "Builds sections serially against the contract, lint-on-save, self-heals before handoff.", writes: "src/, ui-kit/, docs" },
  "3mpq-linter":     { group: "Deterministic gate", order: 0, type: "GATE", role: "Real lint/AST/regex. Font-size floors, banned typography, kit reuse, borders, one accent, tokens. Cannot be argued past.", writes: "LINT.md (block/pass)" },
  "3mpq-judge":      { group: "Critics (parallel, read-only)", order: 0, type: "CRITIC", role: "Visual + spacing + doctrine vs spec, fresh context, written rubric, 2 clean rounds. Hard gate.", writes: "REVIEW.md" },
  "3mpq-kitwarden":  { group: "Critics (parallel, read-only)", order: 1, type: "CRITIC", role: "Did soldier reuse the RIGHT component or build a near-duplicate that should be a variant? Is a new component justified?", writes: "KIT_REVIEW.md" },
  "3mpq-minimalist": { group: "Critics (parallel, read-only)", order: 2, type: "CRITIC", role: "Via negativa. Flags chips, captions, redundant subheadings. What can be removed? Heading + body unless justified.", writes: "MINIMAL_REVIEW.md" },
  "3mpq-naturalist": { group: "Critics (parallel, read-only)", order: 3, type: "CRITIC", role: "Copy naturalness. Ban-list + structure-weighted scorecard. No AI tells, no dashes, concrete numbers.", writes: "NATURAL_REVIEW.md" },
  "3mpq-aesthete":   { group: "Critics (parallel, read-only)", order: 4, type: "CRITIC", role: "Premium feel: rhythm, alignment, restraint, hierarchy. Advisory unless a clear break.", writes: "AESTHETIC_REVIEW.md" },
  "3mpq-completionist": { group: "Critics (parallel, read-only)", order: 5, type: "CRITIC", role: "What is missing: all states (hover/focus/active/empty/loading/error), all breakpoints, all sections.", writes: "COMPLETE_REVIEW.md" },
  "3mpq-factcheck":  { group: "Critics (parallel, read-only)", order: 6, type: "CRITIC", role: "Copy claims vs source of truth. No invented features, specs, or numbers.", writes: "FACT_REVIEW.md" },
  "3mpq-inquisitor": { group: "Critics (parallel, read-only)", order: 7, type: "CRITIC", role: "Final whole-product audit vs best-in-class.", writes: "AUDIT.md" },
  "3mpq-conductor":  { group: "Reconcile & ship", order: 0, type: "ORCH", role: "Merges linter + all critic outputs into one prioritized, de-duplicated action list. Resolves contradictions.", writes: "ACTIONS.md" },
  "3mpq-devops":     { group: "Reconcile & ship", order: 1, type: "ship", role: "Git, security, deploy. Only after FINAL PASSED.", writes: "commits, PRs, deploys" },
};

const GROUP_ORDER = ["Route & plan", "Research & content", "Build", "Deterministic gate", "Critics (parallel, read-only)", "Reconcile & ship"];

const BUILTINS = [
  { name: "general-purpose", desc: "Multi-step research, broad code search, execution when a match is not certain in the first tries.", tools: "all tools" },
  { name: "Explore", desc: "Read-only fan-out search across many files and conventions. Returns the conclusion, not file dumps.", tools: "read-only" },
  { name: "Plan", desc: "Software architect. Step-by-step implementation plans and trade-offs.", tools: "read-only planning" },
  { name: "claude", desc: "Catch-all for tasks that do not fit a specific agent.", tools: "all tools" },
  { name: "claude-code-guide", desc: "Questions about Claude Code, the Agent SDK, and the Anthropic API.", tools: "Bash, Read, WebFetch, WebSearch" },
  { name: "statusline-setup", desc: "Configures the Claude Code status line.", tools: "Read, Edit" },
];

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && val) out[key] = val;
  }
  return out;
}

async function loadAgents() {
  let files = [];
  try { files = (await readdir(AGENTS_DIR)).filter((f) => f.endsWith(".md")); }
  catch { return []; }
  const agents = [];
  for (const f of files) {
    const fm = parseFrontmatter(await readFile(join(AGENTS_DIR, f), "utf8"));
    if (!fm.name) continue;
    const meta = META[fm.name] ?? { group: "Other", order: 99, type: "", role: fm.description || "", writes: "" };
    agents.push({ name: fm.name, model: fm.model || "inherits", role: meta.role, tools: fm.tools || "", writes: meta.writes, group: meta.group, order: meta.order, type: meta.type });
  }
  return agents;
}

async function loadContributions() {
  let raw = "";
  try { raw = await readFile(LEDGER, "utf8"); } catch { return { byAgent: {}, totalInv: 0, totalTok: 0 }; }
  const byAgent = {};
  let totalInv = 0, totalTok = 0;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    const a = (byAgent[r.agent] ??= { count: 0, tokens: 0, last: null, tokenKnown: false });
    a.count++; totalInv++;
    if (typeof r.tokens === "number") { a.tokens += r.tokens; totalTok += r.tokens; a.tokenKnown = true; }
    if (!a.last || r.ts > a.last) a.last = r.ts;
  }
  return { byAgent, totalInv, totalTok };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtTok = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
function rel(ts) {
  if (!ts) return "never";
  const days = Math.floor((Date.parse("2026-06-15T23:59:59Z") - Date.parse(ts)) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return days + " days ago";
}

// Short flow-rail / roster-heading labels for the (sometimes long) group names.
const STAGE_LABEL = {
  "Route & plan": "Route & plan",
  "Research & content": "Research & content",
  "Build": "Build",
  "Deterministic gate": "Deterministic gate",
  "Critics (parallel, read-only)": "Critics",
  "Reconcile & ship": "Reconcile & ship",
};
const stageLabel = (g) => STAGE_LABEL[g] || g;

// One shared bar mechanic. No 6% floor: zero runs render NO bar (handled by
// the caller). Width is the agent's share of the busiest agent's run count.
function involveBar(count, maxCount) {
  const pct = maxCount > 0 ? Math.min(100, Math.round((count / maxCount) * 100)) : 0;
  return `<span class="bar"><span class="bar-fill" style="width:${pct}%"></span></span>`;
}

// A roster row: name + role + contribution. Active = bar + stats. Idle = calm
// dimmed row, hollow dot, one mono line, NO bar. writeLine adds the artifact.
function agentRow(a, contrib, maxCount, writeLine) {
  const c = contrib;
  const idle = !c || c.count === 0;
  if (idle) {
    return `<div class="row row-idle">
      <div class="row-head"><span class="name">${esc(a.name)}</span>${a.model ? `<span class="model">${esc(a.model)}</span>` : ""}</div>
      <p class="role">${esc(a.role || a.desc || "")}</p>
      <div class="contrib contrib-idle"><span class="hollow"></span>not yet invoked, candidate to drop</div>
      ${writeLine && a.writes ? `<p class="writes"><span class="k">writes</span> ${esc(a.writes)}</p>` : ""}
    </div>`;
  }
  const tok = c.tokenKnown ? fmtTok(c.tokens) : "n/a";
  return `<div class="row">
    <div class="row-head"><span class="name">${esc(a.name)}</span>${a.model ? `<span class="model">${esc(a.model)}</span>` : ""}</div>
    <p class="role">${esc(a.role || a.desc || "")}</p>
    <div class="contrib">
      ${involveBar(c.count, maxCount)}
      <span class="stats"><b>${c.count}</b> ${c.count === 1 ? "run" : "runs"} <span class="sep">/</span> ${tok} tok <span class="sep">/</span> ${rel(c.last)}</span>
    </div>
    ${writeLine && a.writes ? `<p class="writes"><span class="k">writes</span> ${esc(a.writes)}</p>` : ""}
  </div>`;
}

// Sort within a stage: active first (runs desc), idle sinks to the bottom.
function sortByRuns(list, byAgent) {
  return [...list].sort((a, b) => {
    const ca = byAgent[a.name]?.count || 0;
    const cb = byAgent[b.name]?.count || 0;
    if (cb !== ca) return cb - ca;
    return a.order - b.order;
  });
}

function page(agents, contrib) {
  const { byAgent, totalInv, totalTok } = contrib;
  const allCounts = Object.values(byAgent).map((c) => c.count);
  const maxCount = allCounts.length ? Math.max(...allCounts) : 1;
  const orchestraTotal = agents.length;
  const idle = agents.filter((a) => !byAgent[a.name] || byAgent[a.name].count === 0).length;

  // Stages for the flow rail and the roster. Rail is a pure flow diagram now:
  // stage name only, no per-stage rollup (counts/load live in the roster below).
  const stages = GROUP_ORDER.map((g) => {
    const list = agents.filter((a) => a.group === g).sort((a, b) => a.order - b.order);
    return { g, list, count: list.length };
  }).filter((s) => s.count > 0);

  const railCells = stages.map((s, i) => {
    const arrow = i < stages.length - 1 ? `<span class="rail-arrow" aria-hidden="true">-&gt;</span>` : "";
    return `<div class="rail-cell">
      <span class="rail-name">${esc(stageLabel(s.g))}</span>
    </div>${arrow}`;
  }).join("");

  // Roster grouped by stage, contribution as the dominant axis (runs desc).
  const roster = stages.map((s) => {
    const sorted = sortByRuns(s.list, byAgent);
    return `<section class="stage">
      <h2>${esc(stageLabel(s.g))}</h2>
      <div class="rows">${sorted.map((a) => agentRow(a, byAgent[a.name], maxCount, true)).join("")}</div>
    </section>`;
  }).join("");

  // Built-ins: quieter appendix. Same row grammar, no writes line, elev tint.
  const builtinSorted = sortByRuns(BUILTINS, byAgent);
  const builtins = builtinSorted.map((a) => agentRow(a, byAgent[a.name], maxCount, false)).join("");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orchestra - Aisoldier agents</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{--bg:#fff;--elev:#f7f7f6;--track:#f0f0ee;--border:#e5e5e5;--border-strong:#d8d8d4;--fg:#161616;--muted:#6b6b68;--dim:#a0a09c;--accent:#217a50;
    --serif:"IBM Plex Serif",Georgia,serif;--sans:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;}
  *{box-sizing:border-box}
  /* Type scale: display h1 clamp(36-48) serif, idle-hero 40 serif, headline 22
     serif, body 16 sans, stat 15 mono, label 12 mono. */
  body{margin:0;background:radial-gradient(circle,#ececec 1px,transparent 1px) 0 0/24px 24px,var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1120px;margin:0 auto;padding:64px 24px 96px}

  /* Masthead */
  .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 16px}
  h1{font-family:var(--serif);font-weight:500;font-size:clamp(36px,5vw,48px);letter-spacing:-.02em;margin:0 0 12px}
  .lede{font-size:16px;color:var(--muted);max-width:62ch;margin:0 0 32px}
  .summary{display:flex;flex-wrap:wrap;align-items:flex-end;gap:32px;border-top:1px solid var(--border);padding-top:24px;margin-bottom:64px}
  .idle-hero{display:flex;flex-direction:column;gap:4px}
  .idle-hero .big{font-family:var(--serif);font-weight:500;font-size:40px;line-height:1;color:var(--accent);letter-spacing:-.02em}
  .idle-hero .cap{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);font-family:var(--mono)}
  .stat-line{display:flex;flex-wrap:wrap;gap:24px;font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:.02em}
  .stat-line b{color:var(--fg);font-weight:500}

  /* Section 1: pipeline flow rail */
  .rail{display:flex;flex-wrap:wrap;align-items:stretch;gap:0;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:64px;background:var(--bg)}
  .rail-cell{flex:1 1 0;min-width:150px;display:flex;align-items:center;padding:16px;border-right:1px solid var(--border)}
  .rail-cell:last-child{border-right:none}
  .rail-name{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;line-height:1.25}
  .rail-arrow{display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:12px;color:var(--dim);padding:0 4px;flex:0 0 auto}

  /* Shared bar mechanic */
  .bar{display:block;width:100%;height:6px;background:var(--track);border-radius:999px;overflow:hidden}
  .bar-fill{display:block;height:100%;background:var(--accent);border-radius:999px}

  /* Section 2/3: roster rows */
  .stage{margin-bottom:48px}
  h2{font-family:var(--serif);font-weight:500;font-size:22px;letter-spacing:-.01em;margin:0 0 8px}
  .rows{border-top:1px solid var(--border)}
  .row{padding:16px 0;border-bottom:1px solid var(--border);transition:opacity .15s}
  .row-idle{opacity:.6;padding:14px 0;border-bottom:1px dashed var(--border)}
  .row-head{display:flex;align-items:baseline;gap:10px;margin-bottom:4px}
  .name{font-family:var(--mono);font-size:15px;font-weight:500}
  .model{font-family:var(--mono);font-size:12px;color:var(--dim)}
  .role{font-size:16px;color:var(--fg);margin:0 0 10px;max-width:78ch}
  .row-idle .role{color:var(--muted);margin-bottom:6px}
  .contrib{display:flex;align-items:center;gap:16px;max-width:520px}
  .contrib .bar{flex:1 1 auto;max-width:240px}
  .stats{font-family:var(--mono);font-size:12px;color:var(--muted);white-space:nowrap}
  .stats b{color:var(--fg);font-weight:500}
  .sep{color:var(--dim);margin:0 4px}
  .contrib-idle{font-family:var(--mono);font-size:12px;color:var(--dim);gap:8px}
  .hollow{width:8px;height:8px;border-radius:50%;border:1px solid var(--dim);flex:0 0 auto}
  .writes{font-family:var(--mono);font-size:12px;color:var(--muted);margin:8px 0 0}
  .writes .k{color:var(--dim);text-transform:uppercase;letter-spacing:.06em;margin-right:8px}

  /* Built-ins appendix: quieter tier on elev surface */
  .appendix{margin-top:64px;background:var(--elev);border:1px solid var(--border);border-radius:12px;padding:24px}
  .appendix h2{margin-bottom:4px}
  .appendix .note{font-size:16px;color:var(--muted);margin:0 0 8px}
  .appendix .rows{border-top:1px solid var(--border-strong)}
  .appendix .row,.appendix .row-idle{border-bottom-color:var(--border-strong)}
  .appendix .bar{background:#eaeae8}

  footer{margin-top:64px;padding-top:24px;border-top:1px solid var(--border);color:var(--dim);font-size:12px;font-family:var(--mono);line-height:1.7}

  /* Below 1120 the rail wraps; hide arrows so none is orphaned, and divide
     wrapped cells with a bottom border. Arrows show only on one line (>=1120). */
  @media (max-width:1119px){
    .rail-arrow{display:none}
    .rail-cell{border-bottom:1px solid var(--border)}
  }

  @media (max-width:640px){
    .wrap{padding:48px 18px 72px}
    .rail-cell{flex:1 1 100%;border-right:none;border-bottom:1px solid var(--border)}
    .rail-cell:last-child{border-bottom:none}
    .rail-arrow{display:none}
    .contrib{flex-wrap:wrap;gap:8px}
    .contrib .bar{max-width:none;flex:1 1 100%}
    .summary{gap:24px}
  }
</style></head>
<body><div class="wrap">
  <p class="eyebrow">Aisoldier</p>
  <h1>The Orchestra</h1>
  <p class="lede">Idle agents have not earned a seat.</p>
  <div class="summary">
    <div class="idle-hero">
      <span class="big">${idle}</span>
      <span class="cap">of ${orchestraTotal} idle</span>
    </div>
    <div class="stat-line">
      <span><b>${orchestraTotal}</b> orchestra agents</span>
      <span><b>${BUILTINS.length}</b> built-in</span>
      <span><b>${totalInv}</b> total runs</span>
      <span><b>${fmtTok(totalTok)}</b> tokens</span>
    </div>
  </div>

  <div class="rail">${railCells}</div>

  ${roster}

  <section class="appendix">
    <h2>Built-in agents</h2>
    <p class="note">Platform agents outside the orchestra.</p>
    <div class="rows">${builtins}</div>
  </section>

  <footer>localhost:${PORT} - agents: .claude/agents - contributions: apps/orchestra/data/contributions.jsonl - log a run: node apps/orchestra/log.mjs &lt;agent&gt; &lt;tokens&gt; &lt;project&gt; "&lt;task&gt;" [verdict]</footer>
</div></body></html>`;
}

const server = createServer(async (req, res) => {
  if (req.url === "/favicon.ico") { res.writeHead(204).end(); return; }
  try {
    const [agents, contrib] = await Promise.all([loadAgents(), loadContributions()]);
    if (req.url === "/agents.json") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ agents, contributions: contrib, builtin: BUILTINS }, null, 2));
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page(agents, contrib));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Orchestra failed: " + err.message);
  }
});
server.listen(PORT, () => {
  console.log(`Orchestra running at http://localhost:${PORT}`);
  console.log(`Agents: ${AGENTS_DIR}`);
  console.log(`Ledger: ${LEDGER}`);
});
