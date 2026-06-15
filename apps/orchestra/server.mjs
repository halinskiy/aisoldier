#!/usr/bin/env node
// Orchestra -- a localhost service that lists every agent in the
// Aisoldier ensemble AND shows each agent's contribution (runs, tokens,
// involvement, recency). Zero dependencies (Node built-in http only).
//
// Agent definitions read LIVE from .claude/agents/*.md. Contributions read
// from data/contributions.jsonl (appended via log.mjs). Idle agents are
// flagged as candidates to drop -- the page exists to show who earns a seat.
//
//   node apps/orchestra/server.mjs            # http://localhost:7777
//   PORT=8080 node apps/orchestra/server.mjs
//
// Type: Manrope only (readable). ASCII-only user-facing text.

import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");
const AGENTS_DIR = join(REPO_ROOT, ".claude", "agents");
const LEDGER = join(HERE, "data", "contributions.jsonl");
const PORT = Number(process.env.PORT) || 7777;

// group: pipeline section. order: sort within section. role: one short
// phrase (minimum text). writes: artifact (kept for /agents.json, not shown).
const META = {
  "3mpq-dispatcher": { group: "Route & plan", order: 0, type: "ORCH", role: "Routes work to the right agents.", writes: "routing plan" },
  "3mpq-director":   { group: "Route & plan", order: 1, type: "ORCH", role: "Sets the bar: one flow, minimum text, air, effect.", writes: "DIRECTION.md" },
  "3mpq-architect":  { group: "Route & plan", order: 2, type: "ORCH", role: "Compiles the build contract.", writes: "SECTION_CONTRACT.md" },
  "3mpq-prompter":   { group: "Route & plan", order: 3, type: "ORCH", role: "Forces design-system-first prompts.", writes: "soldier prompt" },
  "3mpq-researcher": { group: "Research & content", order: 0, type: "content", role: "Trends, competitors, direction.", writes: "research/*.md" },
  "3mpq-economist":  { group: "Research & content", order: 1, type: "content", role: "Pricing and unit economics.", writes: "pricing-brief.md" },
  "3mpq-copywriter": { group: "Research & content", order: 2, type: "content", role: "Writes the copy.", writes: "content/copy.json" },
  "3mpq-humanizer":  { group: "Research & content", order: 3, type: "content", role: "Rewrites AI drafts into plain human text.", writes: "rewritten draft" },
  "3mpq-soldier":    { group: "Build", order: 0, type: "build", role: "Builds the sections.", writes: "src/, ui-kit/" },
  "3mpq-linter":     { group: "Deterministic gate", order: 0, type: "GATE", role: "Hard gate. Cannot be argued past.", writes: "LINT.md" },
  "3mpq-judge":      { group: "Critics (parallel, read-only)", order: 0, type: "CRITIC", role: "Visual and doctrine gate.", writes: "REVIEW.md" },
  "3mpq-kitwarden":  { group: "Critics (parallel, read-only)", order: 1, type: "CRITIC", role: "Guards component reuse.", writes: "KIT_REVIEW.md" },
  "3mpq-minimalist": { group: "Critics (parallel, read-only)", order: 2, type: "CRITIC", role: "Removes the excess.", writes: "MINIMAL_REVIEW.md" },
  "3mpq-naturalist": { group: "Critics (parallel, read-only)", order: 3, type: "CRITIC", role: "Kills AI tells in copy.", writes: "NATURAL_REVIEW.md" },
  "3mpq-aesthete":   { group: "Critics (parallel, read-only)", order: 4, type: "CRITIC", role: "Premium feel and rhythm.", writes: "AESTHETIC_REVIEW.md" },
  "3mpq-completionist": { group: "Critics (parallel, read-only)", order: 5, type: "CRITIC", role: "Finds what is missing.", writes: "COMPLETE_REVIEW.md" },
  "3mpq-factcheck":  { group: "Critics (parallel, read-only)", order: 6, type: "CRITIC", role: "Verifies every claim.", writes: "FACT_REVIEW.md" },
  "3mpq-inquisitor": { group: "Critics (parallel, read-only)", order: 7, type: "CRITIC", role: "Final product audit.", writes: "AUDIT.md" },
  "3mpq-conductor":  { group: "Reconcile & ship", order: 0, type: "ORCH", role: "Reconciles every review.", writes: "ACTIONS.md" },
  "3mpq-devops":     { group: "Reconcile & ship", order: 1, type: "ship", role: "Ships it.", writes: "commits, deploys" },
  "3mpq-archivist":  { group: "Reconcile & ship", order: 2, type: "ORCH", role: "Remembers mistakes so they never repeat.", writes: "LEARNINGS.md, RETRO.md" },
};

const GROUP_ORDER = ["Route & plan", "Research & content", "Build", "Deterministic gate", "Critics (parallel, read-only)", "Reconcile & ship"];
const STAGE_SHORT = { "Critics (parallel, read-only)": "Critics" };
const stageLabel = (g) => STAGE_SHORT[g] || g;

const BUILTINS = [
  { name: "general-purpose", role: "Research, search, multi-step work.", tools: "all tools" },
  { name: "Explore", role: "Read-only fan-out search.", tools: "read-only" },
  { name: "Plan", role: "Implementation plans.", tools: "read-only" },
  { name: "claude", role: "Catch-all.", tools: "all tools" },
  { name: "claude-code-guide", role: "Claude Code and API answers.", tools: "Bash, Read, web" },
  { name: "statusline-setup", role: "Status line config.", tools: "Read, Edit" },
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
  try { raw = await readFile(LEDGER, "utf8"); } catch { return { byAgent: {}, byDay: {}, totalInv: 0, totalTok: 0 }; }
  const byAgent = {};
  const byDay = {};
  let totalInv = 0, totalTok = 0;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    const a = (byAgent[r.agent] ??= { count: 0, tokens: 0, last: null, tokenKnown: false });
    a.count++; totalInv++;
    if (typeof r.tokens === "number") { a.tokens += r.tokens; totalTok += r.tokens; a.tokenKnown = true; }
    if (!a.last || r.ts > a.last) a.last = r.ts;
    const day = String(r.ts).slice(0, 10);
    if (day) byDay[day] = (byDay[day] || 0) + 1;
  }
  return { byAgent, byDay, totalInv, totalTok };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtTok = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
function rel(ts) {
  if (!ts) return "never";
  const days = Math.floor((Date.parse("2026-06-15T23:59:59Z") - Date.parse(ts)) / 86400000);
  if (days <= 0) return "today";
  return days === 1 ? "1d ago" : days + "d ago";
}

function sortByRuns(list, byAgent) {
  return [...list].sort((a, b) => {
    const ca = byAgent[a.name]?.count || 0, cb = byAgent[b.name]?.count || 0;
    return cb !== ca ? cb - ca : a.order - b.order;
  });
}

// One row. Active = name + role + animated bar + run count. Idle = quiet
// name + role + a small "idle" mark, no bar. Minimum text: no writes, no tools.
function agentRow(a, c, maxCount, i) {
  const idle = !c || c.count === 0;
  const d = `style="--d:${(i * 0.04).toFixed(2)}s"`;
  if (idle) {
    return `<div class="row row-idle fx" ${d}>
      <div class="row-main"><span class="name">${esc(a.name)}</span><span class="role">${esc(a.role || "")}</span></div>
      <span class="idle-tag">idle</span>
    </div>`;
  }
  const pct = maxCount > 0 ? Math.min(100, Math.round((c.count / maxCount) * 100)) : 0;
  return `<div class="row fx" ${d}>
    <div class="row-main"><span class="name">${esc(a.name)}</span><span class="role">${esc(a.role || "")}</span></div>
    <div class="meter">
      <span class="bar"><span class="bar-fill" style="width:${pct}%;--d:${(i * 0.04 + 0.15).toFixed(2)}s"></span></span>
      <span class="runs">${c.count}</span>
    </div>
  </div>`;
}

// GitHub-style contributions calendar: weeks as columns (Mon..Sun rows),
// each cell shaded by that day's run count. Appears once (CSS pop), then
// static. Window is the last WEEKS weeks ending today.
function calendar(byDay) {
  const WEEKS = 53, DAY = 86400000;
  const end = new Date("2026-06-15T00:00:00Z");
  const lastSun = new Date(end.getTime() + ((7 - end.getUTCDay()) % 7) * DAY);
  const start = new Date(lastSun.getTime() - (WEEKS * 7 - 1) * DAY);
  let cols = "";
  for (let w = 0; w < WEEKS; w++) {
    let col = "";
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d;
      const dt = new Date(start.getTime() + i * DAY);
      const key = dt.toISOString().slice(0, 10);
      const cnt = byDay[key] || 0;
      const lvl = cnt === 0 ? 0 : cnt <= 2 ? 1 : cnt <= 5 ? 2 : 3;
      col += `<span class="cell l${lvl}" style="--d:${(i * 0.004).toFixed(3)}s" title="${key}: ${cnt} run(s)"></span>`;
    }
    cols += `<div class="cal-col">${col}</div>`;
  }
  return cols;
}

function page(agents, contrib) {
  const { byAgent, byDay, totalInv, totalTok } = contrib;
  const cal = calendar(byDay || {});
  const counts = Object.values(byAgent).map((c) => c.count);
  const maxCount = counts.length ? Math.max(...counts) : 1;
  const total = agents.length;
  const active = agents.filter((a) => byAgent[a.name]?.count > 0).length;
  const idle = total - active;

  const stages = GROUP_ORDER.map((g) => {
    const list = agents.filter((a) => a.group === g).sort((x, y) => x.order - y.order);
    const act = list.filter((a) => byAgent[a.name]?.count > 0).length;
    return { g, list, act };
  }).filter((s) => s.list.length);

  let ri = 0;
  const roster = stages.map((s) => {
    const sorted = sortByRuns(s.list, byAgent);
    return `<section class="stage">
      <h2 class="fx" style="--d:${(ri++ * 0.02).toFixed(2)}s">${esc(stageLabel(s.g))}</h2>
      <div class="rows">${sorted.map((a) => agentRow(a, byAgent[a.name], maxCount, ri++)).join("")}</div>
    </section>`;
  }).join("");

  const builtins = sortByRuns(BUILTINS, byAgent).map((a, i) => agentRow(a, byAgent[a.name], maxCount, i)).join("");

  // Hero equalizer: one bar per orchestra agent in pipeline order. Height
  // = involvement (idle = a quiet floor, static). Active bars pulse like
  // sound, staggered, so the orchestra reads as "playing". Equal widths.
  const eqAgents = [...agents].sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(a.group), gb = GROUP_ORDER.indexOf(b.group);
    return ga !== gb ? ga - gb : a.order - b.order;
  });
  const eq = eqAgents.map((a, i) => {
    const runs = byAgent[a.name]?.count || 0;
    const on = runs > 0;
    const h = on ? Math.round(34 + 66 * Math.min(1, runs / maxCount)) : 12;
    const dur = (1.7 + (i % 6) * 0.18).toFixed(2);
    const dly = (i * 0.08).toFixed(2);
    return `<span class="eq-bar${on ? " on" : ""}" style="height:${h}%;--dur:${dur}s;--d:${dly}s" title="${esc(a.name)}: ${runs} run(s)"></span>`;
  }).join("");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Orchestra</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{--bg:#fcfcfb;--elev:#f5f5f3;--track:#ececea;--line:#e6e6e3;--fg:#15150f;--muted:#5f5f58;--dim:#9a9a92;--accent:#217a50;--accent-soft:#e7f1ea;
    --font:"Manrope",-apple-system,system-ui,sans-serif;
    --display:"Montserrat",-apple-system,system-ui,sans-serif}
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font);font-size:18px;line-height:1.55;font-weight:500;-webkit-font-smoothing:antialiased;letter-spacing:-.01em}
  .wrap{max-width:1080px;margin:0 auto;padding:9vh 32px 14vh}

  /* Swiss grid overlay (gutters). Faint 12-column guide aligned to the
     content column. Toggle in the corner; default on for the first
     prompt, off from the second onward. */
  .grid-overlay{position:fixed;inset:0;z-index:40;pointer-events:none;display:flex;justify-content:center;opacity:0;transition:opacity .3s cubic-bezier(.2,.8,.2,1)}
  body.grid-on .grid-overlay{opacity:1}
  .grid-cols{width:100%;max-width:1080px;padding:0 32px;display:grid;grid-template-columns:repeat(12,1fr);gap:24px;height:100%}
  .grid-c{background:rgba(33,122,80,.05);border-left:1px solid rgba(33,122,80,.09);border-right:1px solid rgba(33,122,80,.09)}
  .grid-toggle{position:fixed;bottom:22px;right:22px;z-index:60;font-family:var(--font);font-size:16px;font-weight:600;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:999px;padding:9px 18px;cursor:pointer;box-shadow:0 8px 24px -12px rgba(0,0,0,.3);transition:all .3s cubic-bezier(.2,.8,.2,1)}
  .grid-toggle:hover{transform:translateY(-2px)}
  body.grid-on .grid-toggle{color:#fff;background:var(--accent);border-color:var(--accent)}

  /* Type scale: 4 sizes, all >= 16. Hero clamp(56-104), section 34, body 18, meta 16. */
  .hero{margin-bottom:13vh}
  .kicker{font-family:var(--display);font-size:16px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin:0 0 24px}
  h1{font-family:var(--display);font-size:clamp(56px,11vw,104px);font-weight:800;line-height:.95;letter-spacing:-.04em;margin:0 0 28px}
  .sub{font-size:22px;font-weight:500;color:var(--muted);max-width:24ch;margin:0 0 56px;line-height:1.4}
  /* Hero equalizer: equal-width bars that morph UP once on load (AirBnB
     spring), then rest. No looping. */
  .eq{display:flex;align-items:flex-end;gap:6px;height:180px;margin:7vh 0 56px}
  .eq-bar{flex:1 1 0;min-width:0;background:var(--track);border-radius:7px 7px 0 0;transform-origin:bottom;animation:eqgrow .9s cubic-bezier(.34,1.18,.64,1) both;animation-delay:var(--d,0s)}
  .eq-bar.on{background:var(--accent)}
  @keyframes eqgrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @media (prefers-reduced-motion:reduce){.eq-bar{animation:none}}
  .figures{display:flex;flex-wrap:wrap;gap:56px;align-items:flex-end}
  .fig{display:flex;flex-direction:column;gap:6px}
  .fig .n{font-family:var(--display);font-size:64px;font-weight:800;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
  .fig .n.accent{color:var(--accent)}
  .fig .l{font-size:16px;font-weight:600;color:var(--muted);letter-spacing:.01em}

  /* Pipeline flow: big nodes connected by arrows */
  /* Equal cells: flex:1 1 0 -> identical width; align-items:stretch ->
     identical height; the name reserves 2 lines so the counts line up
     across every node regardless of label length. Symmetry over content. */
  /* Contributions calendar (GitHub-style). Cells pop in once, staggered. */
  .contrib-cal{margin-bottom:13vh}
  .cal{display:flex;gap:4px;margin:0 0 16px;width:100%}
  .cal-col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:4px}
  .cell{width:100%;aspect-ratio:1;border-radius:4px;background:var(--track);transform-origin:center;animation:pop .5s cubic-bezier(.34,1.42,.5,1) both;animation-delay:var(--d,0s)}
  .cell.l1{background:#cfe8da}
  .cell.l2{background:#7cc39c}
  .cell.l3{background:var(--accent)}
  @keyframes pop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
  .cal-legend{display:flex;align-items:center;gap:6px;font-size:16px;color:var(--muted)}
  .cal-legend .cell{flex:0 0 auto;width:16px;height:16px;aspect-ratio:auto;animation:none}
  @media (prefers-reduced-motion:reduce){.cell{animation:none}}

  .flow{display:flex;flex-wrap:wrap;align-items:stretch;gap:14px 10px;margin-bottom:13vh}
  /* AirBnB-style: nodes morph in with a soft spring (scale + rise) once,
     then a smooth morph on hover (grow, lift, soft shadow). */
  .node{flex:1 1 0;min-width:0;display:flex;flex-direction:column;justify-content:space-between;border:1.5px solid var(--line);border-radius:20px;padding:22px 20px;background:#fff;transition:transform .45s cubic-bezier(.2,.8,.2,1),border-color .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s cubic-bezier(.2,.8,.2,1),background .45s cubic-bezier(.2,.8,.2,1)}
  .node.morph{animation:morphin .85s cubic-bezier(.34,1.42,.5,1) both;animation-delay:var(--d,0s)}
  @keyframes morphin{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:none}}
  .node:hover{transform:translateY(-8px) scale(1.035);box-shadow:0 28px 56px -30px rgba(0,0,0,.32);border-color:var(--accent)}
  .node-on{border-color:var(--accent);background:var(--accent-soft)}
  @media (prefers-reduced-motion:reduce){.node.morph{animation:none}}
  .node-name{display:block;font-size:16px;font-weight:700;line-height:1.2;margin-bottom:14px;min-height:2.4em}
  .node-count{font-family:var(--display);font-size:34px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
  .node-count i{font-style:normal;font-size:18px;font-weight:600;color:var(--dim)}
  .node-on .node-count{color:var(--accent)}
  .node-arrow{flex:0 0 auto;color:var(--dim);font-size:22px;font-weight:700}

  /* Roster */
  .stage{margin-bottom:9vh}
  h2{font-family:var(--display);font-size:34px;font-weight:800;letter-spacing:-.03em;margin:0 0 8px}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;align-items:center;gap:28px;padding:24px 8px;border-top:1px solid var(--line);transition:background .18s,padding-left .18s}
  .row:last-child{border-bottom:1px solid var(--line)}
  .row:hover{background:var(--elev);padding-left:16px}
  .row-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px}
  .name{font-size:21px;font-weight:700;letter-spacing:-.02em}
  .role{font-size:17px;font-weight:500;color:var(--muted)}
  .meter{flex:0 0 240px;display:flex;align-items:center;gap:16px}
  .bar{flex:1 1 auto;height:8px;background:var(--track);border-radius:999px;overflow:hidden}
  .bar-fill{display:block;height:100%;background:var(--accent);border-radius:999px;transform-origin:left center;animation:grow 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
  .runs{font-family:var(--display);font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;min-width:24px;text-align:right}
  .sub{flex:0 0 auto;font-size:16px;font-weight:500;color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
  .row-idle{opacity:.5}
  .row-idle:hover{opacity:.85}
  .idle-tag{flex:0 0 auto;font-size:16px;font-weight:600;color:var(--dim)}

  .appendix{margin-top:11vh}
  .appendix h2{font-size:24px;color:var(--muted)}

  footer{margin-top:13vh;font-size:16px;color:var(--dim);line-height:1.7}

  /* Motion */
  .fx{opacity:0;animation:up .7s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
  @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @media (prefers-reduced-motion:reduce){.fx,.bar-fill{animation:none;opacity:1;transform:none}}

  @media (max-width:720px){
    .wrap{padding:7vh 22px 12vh}
    .row{flex-wrap:wrap;gap:12px}
    .meter{flex:1 1 100%;order:3}
    .sub{order:4}
    .node-arrow{display:none}
    .figures{gap:32px}
    .fig .n{font-size:48px}
  }
</style></head>
<body class="grid-on">
  <div class="grid-overlay" aria-hidden="true"><div class="grid-cols">${Array.from({ length: 12 }).map(() => '<span class="grid-c"></span>').join("")}</div></div>
  <button type="button" class="grid-toggle" onclick="document.body.classList.toggle('grid-on')">Grid</button>
  <div class="wrap">

  <section class="contrib-cal">
    <h2 class="fx">Contributions</h2>
    <div class="cal fx" style="--d:.06s">${cal}</div>
    <div class="cal-legend fx" style="--d:.1s">Less<span class="cell l0"></span><span class="cell l1"></span><span class="cell l2"></span><span class="cell l3"></span>More</div>
  </section>

  ${roster}

  <section class="stage appendix">
    <h2 class="fx">Built-in</h2>
    <div class="rows">${builtins}</div>
  </section>

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
