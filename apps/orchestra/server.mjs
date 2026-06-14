#!/usr/bin/env node
// Orchestra -- a tiny localhost service that lists every agent in the
// Aisoldier ensemble. Zero dependencies (Node built-in http only). It
// reads the real agent definitions from `.claude/agents/*.md` at request
// time, so it always reflects the live roster -- add or edit an agent and
// just refresh the page.
//
//   node apps/orchestra/server.mjs            # serves on http://localhost:7777
//   PORT=8080 node apps/orchestra/server.mjs  # custom port
//
// ASCII-only in everything user-facing (studio discipline: no em-dash,
// no bullet glyph, no curly quote).

import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");
const AGENTS_DIR = join(REPO_ROOT, ".claude", "agents");
const PORT = Number(process.env.PORT) || 7777;

// Curated metadata per orchestra agent: pipeline stage, the one-line
// role, and what the agent writes to. The live description / tools /
// model come from the .md frontmatter at request time; this map only
// adds the doctrine context that is not in the frontmatter.
const ORCHESTRA_META = {
  "3mpq-dispatcher": { stage: 0, role: "Task router. Classifies the request into a tier and returns the routing plan before any work starts.", writes: "routing plan (in reply)" },
  "3mpq-researcher": { stage: 1, role: "Design research and trend analysis. Kickoff research and per-section creative direction.", writes: "research/*.md, CORRECTIONS.md" },
  "3mpq-economist": { stage: 2, role: "Business economics. Pricing, unit economics, breakeven, channel costs.", writes: "ECONOMICS.md, STRATEGY.md, content/pricing-brief.md" },
  "3mpq-copywriter": { stage: 3, role: "Copy and SEO. Headlines, CTAs, long-form, meta. BBC style, no AI cliches, no dashes.", writes: "content/copy.json, COPY_AUDIT.md" },
  "3mpq-soldier": { stage: 4, role: "Builder. Designs and builds sections in React / Next.js against the shared kit.", writes: "src/, ui-kit/, CHANGELOG.md, HANDOFF.md" },
  "3mpq-judge": { stage: 5, role: "Visual QA and doctrine gate. Independent screenshots and CDP checks vs FIGMA_SPEC. Nothing reaches the user without PASSED.", writes: "REVIEW.md" },
  "3mpq-inquisitor": { stage: 6, role: "Product-level auditor of a finished product. Drives it live, scores visual / copy / CRO / tech vs best-in-class.", writes: "AUDIT.md" },
  "3mpq-devops": { stage: 7, role: "Git, security audit, PR, deploy. Runs only after FINAL PASSED.", writes: "commits, PRs, deploys" },
};

// Built-in agents available to dispatch alongside the orchestra.
const BUILTINS = [
  { name: "general-purpose", model: "inherits", desc: "Multi-step research, broad code search, and execution when a match is not certain in the first tries.", tools: "all tools" },
  { name: "Explore", model: "inherits", desc: "Read-only fan-out search across many files and naming conventions. Returns the conclusion, not file dumps.", tools: "read-only (no edit / write / agent)" },
  { name: "Plan", model: "inherits", desc: "Software architect. Designs step-by-step implementation plans and weighs trade-offs.", tools: "read-only planning set" },
  { name: "claude", model: "inherits", desc: "Catch-all for tasks that do not fit a specific agent. The default when no agent is named.", tools: "all tools" },
  { name: "claude-code-guide", model: "inherits", desc: "Answers questions about Claude Code, the Agent SDK, and the Anthropic API.", tools: "Bash, Read, WebFetch, WebSearch" },
  { name: "statusline-setup", model: "inherits", desc: "Configures the Claude Code status line.", tools: "Read, Edit" },
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

async function loadOrchestra() {
  let files = [];
  try { files = (await readdir(AGENTS_DIR)).filter((f) => f.endsWith(".md")); }
  catch { return []; }
  const agents = [];
  for (const f of files) {
    const fm = parseFrontmatter(await readFile(join(AGENTS_DIR, f), "utf8"));
    if (!fm.name) continue;
    const meta = ORCHESTRA_META[fm.name] ?? { stage: 99, role: "", writes: "" };
    agents.push({
      name: fm.name,
      model: fm.model || "inherits",
      desc: meta.role || fm.description || "",
      detail: fm.description || "",
      tools: fm.tools || "",
      writes: meta.writes || "",
      stage: meta.stage,
    });
  }
  return agents.sort((a, b) => a.stage - b.stage);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function modelBadge(model) {
  const m = model.toLowerCase();
  const cls = m.includes("opus") ? "opus" : m.includes("sonnet") ? "sonnet" : m.includes("haiku") ? "haiku" : "inherit";
  return `<span class="badge badge-${cls}">${esc(model)}</span>`;
}

function toolChips(tools) {
  if (!tools) return "";
  const list = tools.split(",").map((t) => t.trim()).filter(Boolean);
  const shown = list.slice(0, 14);
  const more = list.length - shown.length;
  return `<div class="tools">${shown.map((t) => `<span class="tool">${esc(t)}</span>`).join("")}${more > 0 ? `<span class="tool tool-more">+${more} more</span>` : ""}</div>`;
}

function orchestraCard(a) {
  return `
  <article class="card">
    <div class="card-top">
      <span class="stage">${a.stage}</span>
      <h3 class="name">${esc(a.name)}</h3>
      ${modelBadge(a.model)}
    </div>
    <p class="role">${esc(a.desc)}</p>
    ${a.writes ? `<p class="writes"><span class="k">writes</span> ${esc(a.writes)}</p>` : ""}
    ${toolChips(a.tools)}
  </article>`;
}

function builtinCard(a) {
  return `
  <article class="card card-builtin">
    <div class="card-top">
      <h3 class="name">${esc(a.name)}</h3>
      ${modelBadge(a.model)}
    </div>
    <p class="role">${esc(a.desc)}</p>
    ${toolChips(a.tools)}
  </article>`;
}

function pipeline(agents) {
  const flow = agents.filter((a) => a.stage <= 7).map((a) => a.name.replace("3mpq-", ""));
  return flow.join(" &rarr; ");
}

function page(agents) {
  const total = agents.length + BUILTINS.length;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orchestra - Aisoldier agents</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#ffffff; --elev:#f7f7f6; --border:#e5e5e5; --border-strong:#d8d8d4;
    --fg:#161616; --muted:#6b6b68; --dim:#a0a09c; --accent:#217a50;
    --serif:"IBM Plex Serif",Georgia,serif; --sans:"IBM Plex Sans",system-ui,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;background:
    radial-gradient(circle, #ececec 1px, transparent 1px) 0 0/24px 24px,
    var(--bg);
    color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.5;
    -webkit-font-smoothing:antialiased;}
  .wrap{max-width:1080px;margin:0 auto;padding:72px 24px 96px}
  header{margin-bottom:48px}
  .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 12px}
  h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,5vw,56px);letter-spacing:-.02em;margin:0 0 10px}
  .lede{font-size:18px;color:var(--muted);max-width:60ch;margin:0}
  .count{font-family:var(--mono);font-size:13px;color:var(--dim);margin-top:16px}
  h2{font-family:var(--serif);font-weight:500;font-size:24px;letter-spacing:-.01em;margin:56px 0 6px}
  .section-sub{color:var(--muted);font-size:15px;margin:0 0 24px}
  .flow{font-family:var(--mono);font-size:13.5px;color:var(--fg);background:var(--elev);
    border:1px solid var(--border);border-radius:12px;padding:16px 18px;line-height:1.9;
    word-spacing:.1em;margin:0 0 8px}
  .flow .loop{color:var(--muted)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;margin-top:8px}
  .card{border:1px solid var(--border);border-radius:12px;background:var(--bg);padding:18px 18px 16px;
    transition:border-color .15s cubic-bezier(.16,1,.3,1),box-shadow .15s cubic-bezier(.16,1,.3,1)}
  .card:hover{border-color:var(--border-strong);box-shadow:0 1px 0 var(--border),0 8px 24px -16px rgba(0,0,0,.18)}
  .card-builtin{background:var(--elev)}
  .card-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .stage{flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--accent);color:#fff;
    font-family:var(--mono);font-size:12px;font-weight:500;display:inline-flex;align-items:center;justify-content:center}
  .name{font-family:var(--mono);font-size:15px;font-weight:500;margin:0;flex:1;min-width:0}
  .role{font-size:14.5px;color:var(--fg);margin:0 0 10px;line-height:1.5}
  .writes{font-size:13px;color:var(--muted);margin:0 0 10px;font-family:var(--mono)}
  .writes .k{color:var(--dim);text-transform:uppercase;font-size:11px;letter-spacing:.06em;margin-right:6px}
  .tools{display:flex;flex-wrap:wrap;gap:5px}
  .tool{font-family:var(--mono);font-size:11px;color:var(--muted);background:var(--elev);
    border:1px solid var(--border);border-radius:6px;padding:2px 7px}
  .card-builtin .tool{background:var(--bg)}
  .tool-more{color:var(--dim)}
  .badge{font-family:var(--mono);font-size:11px;font-weight:500;border-radius:6px;padding:2px 8px;border:1px solid var(--border-strong);color:var(--muted)}
  .badge-opus{border-color:var(--accent);color:var(--accent)}
  .badge-sonnet{border-color:#b07b1a;color:#b07b1a}
  .badge-haiku{border-color:var(--dim);color:var(--muted)}
  footer{margin-top:64px;padding-top:24px;border-top:1px solid var(--border);color:var(--dim);font-size:13px;font-family:var(--mono)}
  footer a{color:var(--muted)}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <p class="eyebrow">Aisoldier</p>
    <h1>The Orchestra</h1>
    <p class="lede">Every agent in the ensemble. The 3mpq orchestra runs the build pipeline; the built-in agents are dispatched for search, planning, and one-off tasks.</p>
    <p class="count">${total} agents - ${agents.length} orchestra, ${BUILTINS.length} built-in - read live from .claude/agents</p>
  </header>

  <section>
    <h2>Pipeline</h2>
    <p class="section-sub">Order of play from request to deploy. The judge is a hard gate: nothing reaches the user without a PASSED verdict, and ISSUES loop back to the soldier.</p>
    <div class="flow">${pipeline(agents)}<br><span class="loop">judge ISSUES -&gt; back to soldier -&gt; judge re-review, until PASSED</span></div>
  </section>

  <section>
    <h2>The 3mpq orchestra</h2>
    <p class="section-sub">Eight chairs, each a specialist. Descriptions, tools, and model are read from the live agent files.</p>
    <div class="grid">
      ${agents.map(orchestraCard).join("")}
    </div>
  </section>

  <section>
    <h2>Built-in agents</h2>
    <p class="section-sub">General-purpose agents available to dispatch when the orchestra does not fit.</p>
    <div class="grid">
      ${BUILTINS.map(builtinCard).join("")}
    </div>
  </section>

  <footer>
    Orchestra service - localhost:${PORT} - source: Aisoldier/.claude/agents - refresh to re-read
  </footer>
</div>
</body>
</html>`;
}

const server = createServer(async (req, res) => {
  if (req.url === "/favicon.ico") { res.writeHead(204).end(); return; }
  if (req.url === "/agents.json") {
    const agents = await loadOrchestra();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ orchestra: agents, builtin: BUILTINS }, null, 2));
    return;
  }
  try {
    const agents = await loadOrchestra();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page(agents));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Orchestra failed to render: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Orchestra running at http://localhost:${PORT}`);
  console.log(`Reading agents from ${AGENTS_DIR}`);
});
