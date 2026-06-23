#!/usr/bin/env node
// scroll-probe -- the SCRUB gate the static screenshot tool cannot cover.
// Drives REAL Chrome (not --screenshot mode), so scroll-driven JS actually
// runs: it captures the console (catching framer-motion "Target ref is
// defined but not hydrated" and any other error), scrolls to a list of
// absolute scrollY positions, lets the spring settle, and screenshots each.
//
//   node tools/scroll-probe.mjs <url> --positions=650,1550,2300 --tag=hero [--width=1440] [--height=900] [--out=/tmp/probe]
//
// Uses Node 22's built-in WebSocket to talk CDP directly -- zero deps.
// Exits non-zero if Chrome is missing or any console "error" was seen, so a
// pipeline step can treat a console error as a failed gate.

import { execFile } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

function arg(name, dflt) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
}

const url = process.argv[2];
if (!url) {
  console.error("usage: node tools/scroll-probe.mjs <url> --positions=0,650,1550 [--tag=t] [--width=1440] [--height=900] [--out=dir]");
  process.exit(2);
}
const positions = arg("positions", "0").split(",").map((n) => parseInt(n, 10));
const tag = arg("tag", "probe");
const width = parseInt(arg("width", "1440"), 10);
const height = parseInt(arg("height", "900"), 10);
const outDir = arg("out", "/tmp/probe");

async function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    if (await stat(c).then(() => true).catch(() => false)) return c;
  }
  return null;
}
const chrome = await findChrome();
if (!chrome) { console.error("ERROR: no Chrome found."); process.exit(1); }
await mkdir(outDir, { recursive: true });

const port = 9300 + Math.floor(Math.random() * 400);
const userDir = `/tmp/scroll-probe-${port}`;
const child = execFile(chrome, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDir}`,
  `--window-size=${width},${height}`,
  "about:blank",
]);

// wait for the debugging endpoint
let wsUrl = null;
for (let i = 0; i < 50; i++) {
  await sleep(200);
  try {
    const r = await fetch(`http://127.0.0.1:${port}/json/version`);
    const j = await r.json();
    wsUrl = j.webSocketDebuggerUrl;
    if (wsUrl) break;
  } catch {}
}
if (!wsUrl) { console.error("ERROR: Chrome CDP endpoint never came up."); child.kill(); process.exit(1); }

const ws = new WebSocket(wsUrl);
let msgId = 0;
const pending = new Map();
const events = [];
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method) events.push(m);
};
function send(method, params = {}, sessionId) {
  const id = ++msgId;
  const payload = { id, method, params };
  if (sessionId) payload.sessionId = sessionId;
  return new Promise((res) => { pending.set(id, res); ws.send(JSON.stringify(payload)); });
}

// attach to the page target
const { result: { targetInfos } } = await send("Target.getTargets");
const page = targetInfos.find((t) => t.type === "page");
const { result: { sessionId } } = await send("Target.attachToTarget", { targetId: page.targetId, flatten: true });

const consoleErrors = [];
const consoleAll = [];
// route console + exceptions through the session
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.sessionId !== sessionId) return;
  if (m.method === "Runtime.consoleAPICalled") {
    const text = (m.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(" ");
    consoleAll.push(`[${m.params.type}] ${text}`);
    if (m.params.type === "error") consoleErrors.push(text);
  }
  if (m.method === "Runtime.exceptionThrown") {
    const d = m.params.exceptionDetails;
    const text = d.exception?.description || d.text || "exception";
    consoleAll.push(`[exception] ${text}`);
    consoleErrors.push(text);
  }
});

await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Page.setDeviceMetricsOverride", {
  width, height, deviceScaleFactor: 1, mobile: false,
}, sessionId);

// navigate and wait for load
await send("Page.navigate", { url }, sessionId);
await sleep(3500); // hydration + first paint + Lenis init

async function evalJs(expr) {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
  return r.result?.result?.value;
}

const docHeight = await evalJs("document.documentElement.scrollHeight");
const probes = [];
for (const y of positions) {
  await evalJs(`window.scrollTo(0, ${y})`);
  await sleep(1200); // let the spring settle at this position
  const info = await evalJs(`(${() => ({
    scrollY: Math.round(window.scrollY),
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  })})()`);
  const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  const file = join(outDir, `${tag}-y${y}.png`);
  await writeFile(file, Buffer.from(shot.result.data, "base64"));
  probes.push({ y, file, info });
  console.log(`probe y=${y} -> ${file} (scrollY=${info.scrollY}, docW=${info.scrollWidth}/${info.clientWidth})`);
}

console.log(`\ndoc scrollHeight: ${docHeight}px`);
console.log(`console errors: ${consoleErrors.length}`);
for (const e of consoleErrors.slice(0, 20)) console.log("  ERR " + e.replace(/\s+/g, " ").slice(0, 200));

ws.close();
child.kill();
await sleep(300);

// fail the gate on any console error
process.exit(consoleErrors.length ? 3 : 0);
