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

function modelBadge(model) {
  const m = model.toLowerCase();
  const cls = m.includes("opus") ? "opus" : m.includes("sonnet") ? "sonnet" : m.includes("haiku") ? "haiku" : "inherit";
  return `<span class="badge badge-${cls}">${esc(model)}</span>`;
}
function typeBadge(type) {
  if (!type) return "";
  const label = { ORCH: "orchestration", content: "content", build: "build", GATE: "gate", CRITIC: "critic", ship: "ship" }[type] || type;
  return `<span class="type type-${type}">${label}</span>`;
}
function toolChips(tools) {
  if (!tools) return "";
  const list = tools.split(",").map((t) => t.trim()).filter(Boolean);
  const shown = list.slice(0, 10);
  const more = list.length - shown.length;
  return `<div class="tools">${shown.map((t) => `<span class="tool">${esc(t)}</span>`).join("")}${more > 0 ? `<span class="tool tool-more">+${more}</span>` : ""}</div>`;
}

function contribStrip(name, c, maxCount) {
  if (!c || c.count === 0) {
    return `<div class="contrib contrib-zero"><span class="dot"></span>not yet invoked - candidate to drop</div>`;
  }
  const pct = maxCount ? Math.max(6, Math.round((c.count / maxCount) * 100)) : 0;
  const tok = c.tokenKnown ? fmtTok(c.tokens) : "n/a";
  return `<div class="contrib">
    <div class="contrib-bar"><span style="width:${pct}%"></span></div>
    <div class="contrib-stats"><b>${c.count}</b> ${c.count === 1 ? "run" : "runs"} <span class="sep">/</span> ${tok} tok <span class="sep">/</span> ${rel(c.last)}</div>
  </div>`;
}

function agentCard(a, contrib, maxCount) {
  return `
  <article class="card${(!contrib || contrib.count === 0) ? " card-idle" : ""}">
    <div class="card-top">
      <h3 class="name">${esc(a.name)}</h3>
      ${typeBadge(a.type)}
      ${modelBadge(a.model)}
    </div>
    <p class="role">${esc(a.role)}</p>
    ${a.writes ? `<p class="writes"><span class="k">writes</span> ${esc(a.writes)}</p>` : ""}
    ${contribStrip(a.name, contrib, maxCount)}
    ${toolChips(a.tools)}
  </article>`;
}

function builtinCard(a, contrib, maxCount) {
  return `
  <article class="card card-builtin${(!contrib || contrib.count === 0) ? " card-idle" : ""}">
    <div class="card-top"><h3 class="name">${esc(a.name)}</h3></div>
    <p class="role">${esc(a.desc)}</p>
    ${contribStrip(a.name, contrib, maxCount)}
    ${toolChips(a.tools)}
  </article>`;
}

function page(agents, contrib) {
  const { byAgent, totalInv, totalTok } = contrib;
  const allCounts = Object.values(byAgent).map((c) => c.count);
  const maxCount = allCounts.length ? Math.max(...allCounts) : 1;
  const orchestraTotal = agents.length;
  const idle = agents.filter((a) => !byAgent[a.name] || byAgent[a.name].count === 0).length;

  const groups = GROUP_ORDER.map((g) => {
    const list = agents.filter((a) => a.group === g).sort((a, b) => a.order - b.order);
    if (!list.length) return "";
    return `<section><h2>${esc(g)}</h2><div class="grid">${list.map((a) => agentCard(a, byAgent[a.name], maxCount)).join("")}</div></section>`;
  }).join("");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orchestra - Aisoldier agents</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{--bg:#fff;--elev:#f7f7f6;--border:#e5e5e5;--border-strong:#d8d8d4;--fg:#161616;--muted:#6b6b68;--dim:#a0a09c;--accent:#217a50;
    --serif:"IBM Plex Serif",Georgia,serif;--sans:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;}
  *{box-sizing:border-box}
  body{margin:0;background:radial-gradient(circle,#ececec 1px,transparent 1px) 0 0/24px 24px,var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1120px;margin:0 auto;padding:64px 24px 96px}
  .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 12px}
  h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,5vw,56px);letter-spacing:-.02em;margin:0 0 10px}
  .lede{font-size:18px;color:var(--muted);max-width:62ch;margin:0 0 20px}
  .summary{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}
  .stat{font-family:var(--mono);font-size:12.5px;color:var(--muted);background:var(--elev);border:1px solid var(--border);border-radius:8px;padding:7px 12px}
  .stat b{color:var(--fg);font-weight:500}
  h2{font-family:var(--serif);font-weight:500;font-size:22px;letter-spacing:-.01em;margin:48px 0 14px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
  .card{border:1px solid var(--border);border-radius:12px;background:var(--bg);padding:16px 16px 14px;transition:border-color .15s,box-shadow .15s}
  .card:hover{border-color:var(--border-strong);box-shadow:0 8px 24px -16px rgba(0,0,0,.18)}
  .card-builtin{background:var(--elev)}
  .card-idle{opacity:.72;border-style:dashed}
  .card-top{display:flex;align-items:center;gap:8px;margin-bottom:9px;flex-wrap:wrap}
  .name{font-family:var(--mono);font-size:14.5px;font-weight:500;margin:0;flex:1;min-width:0}
  .role{font-size:14px;color:var(--fg);margin:0 0 9px;line-height:1.5}
  .writes{font-size:12px;color:var(--muted);margin:0 0 10px;font-family:var(--mono)}
  .writes .k{color:var(--dim);text-transform:uppercase;font-size:10px;letter-spacing:.06em;margin-right:6px}
  .contrib{margin:0 0 10px}
  .contrib-bar{height:6px;background:var(--elev);border:1px solid var(--border);border-radius:999px;overflow:hidden;margin-bottom:6px}
  .contrib-bar span{display:block;height:100%;background:var(--accent)}
  .contrib-stats{font-family:var(--mono);font-size:11.5px;color:var(--muted)}
  .contrib-stats b{color:var(--fg);font-weight:600}
  .contrib-stats .sep{color:var(--dim);margin:0 5px}
  .contrib-zero{font-family:var(--mono);font-size:11.5px;color:var(--dim);display:flex;align-items:center;gap:7px}
  .contrib-zero .dot{width:7px;height:7px;border-radius:50%;background:#c98b1a;flex-shrink:0}
  .tools{display:flex;flex-wrap:wrap;gap:5px}
  .tool{font-family:var(--mono);font-size:10.5px;color:var(--muted);background:var(--elev);border:1px solid var(--border);border-radius:6px;padding:2px 7px}
  .card-builtin .tool{background:var(--bg)}
  .tool-more{color:var(--dim)}
  .badge{font-family:var(--mono);font-size:10.5px;font-weight:500;border-radius:6px;padding:2px 7px;border:1px solid var(--border-strong);color:var(--muted)}
  .badge-opus{border-color:var(--accent);color:var(--accent)}
  .badge-sonnet{border-color:#b07b1a;color:#b07b1a}
  .badge-haiku{border-color:var(--dim);color:var(--muted)}
  .type{font-family:var(--mono);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.04em;border-radius:6px;padding:2px 7px;background:var(--elev);border:1px solid var(--border);color:var(--muted)}
  .type-GATE{border-color:var(--fg);color:var(--fg)}
  .type-CRITIC{border-color:var(--accent);color:var(--accent)}
  footer{margin-top:56px;padding-top:24px;border-top:1px solid var(--border);color:var(--dim);font-size:12.5px;font-family:var(--mono)}
</style></head>
<body><div class="wrap">
  <p class="eyebrow">Aisoldier</p>
  <h1>The Orchestra</h1>
  <p class="lede">Every agent in the ensemble, with its contribution. Bars show share of total runs; idle agents (dashed) have not earned their seat yet. Read live from .claude/agents and the contribution ledger.</p>
  <div class="summary">
    <span class="stat"><b>${orchestraTotal}</b> orchestra agents</span>
    <span class="stat"><b>${BUILTINS.length}</b> built-in</span>
    <span class="stat"><b>${totalInv}</b> total runs logged</span>
    <span class="stat"><b>${fmtTok(totalTok)}</b> tokens logged</span>
    <span class="stat"><b>${idle}</b> orchestra idle (0 runs)</span>
  </div>
  ${groups}
  <section><h2>Built-in agents</h2><div class="grid">${BUILTINS.map((a) => builtinCard(a, byAgent[a.name], maxCount)).join("")}</div></section>
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
