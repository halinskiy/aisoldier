#!/usr/bin/env node
// ds-lint -- the deterministic design-system + doctrine gate driven by
// 3mpq-linter. Zero dependencies. Scans a project src tree for the
// machine-checkable rules that must never be argued past. Exits non-zero
// if any ERROR-severity violation is found (blocks the build).
//
//   node tools/ds-lint.mjs <src-path>     # default: ./src
//
// v1 ruleset (expand as needed):
//   - banned typography: em-dash, en-dash, minus sign, bullet, middle
//     dot, curly quotes (ERROR in content/*.json and JSX text)
//   - font-size floor: text-[<16px] / fontSize literals < 16 (ERROR <14,
//     WARN 14-15); 12px allowed only for uppercase eyebrow labels
//   - raw hex colors in .tsx/.ts outside the token layer (WARN)

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const SRC = process.argv[2] || "src";
const findings = [];
const add = (sev, file, line, rule, found, fix) => findings.push({ sev, file, line, rule, found, fix });

const BANNED = [
  ["—", "em-dash"], ["–", "en-dash"], ["−", "minus-sign"],
  ["•", "bullet"], ["·", "middle-dot"],
  ["“", "curly-quote"], ["”", "curly-quote"],
  ["‘", "curly-quote"], ["’", "curly-apostrophe"],
];

async function walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", "out", ".git", "dist"].includes(e.name)) continue;
      out.push(...(await walk(p)));
    } else out.push(p);
  }
  return out;
}

function scan(file, text) {
  const isCopyJson = file.endsWith(".json") && file.includes("content");
  const isSource = [".tsx", ".ts"].includes(extname(file));
  if (!isCopyJson && !isSource) return;
  const lines = text.split("\n");
  lines.forEach((ln, i) => {
    const n = i + 1;
    // banned typography
    for (const [ch, name] of BANNED) {
      if (ln.includes(ch)) {
        // straight-quote/dash fixes are obvious; report each char
        add(isCopyJson || /["'>]/.test(ln) ? "ERROR" : "WARN", file, n, `banned-typography:${name}`, ch, "replace with ASCII (',\",-, or reword)");
      }
    }
    // font-size floor
    let m;
    const sizeRe = /(?:text-\[(\d+)px\]|font-size:\s*(\d+)px|fontSize:\s*["'](\d+)px)/g;
    while ((m = sizeRe.exec(ln))) {
      const px = Number(m[1] || m[2] || m[3]);
      if (px < 16) add("ERROR", file, n, "font-size-floor", `${px}px`, "min 16px; all text must read easily (no sub-16 anywhere)");
    }
    // raw hex in source (token layer excluded)
    if (isSource && !/tokens|theme|globals\.css/i.test(file)) {
      const hexRe = /#[0-9a-fA-F]{6}\b/g;
      let h;
      while ((h = hexRe.exec(ln))) {
        if (/--|var\(|data-tokens/.test(ln)) continue;
        add("WARN", file, n, "raw-hex", h[0], "use a token (var(--color-*)) instead of a literal hex");
      }
    }
  });
}

const root = (await stat(SRC).catch(() => null)) ? SRC : ".";
const files = await walk(root);
for (const f of files) {
  if (![".tsx", ".ts", ".json"].includes(extname(f))) continue;
  if (f.endsWith(".json") && !f.includes("content")) continue;
  let text; try { text = await readFile(f, "utf8"); } catch { continue; }
  scan(f, text);
}

const errors = findings.filter((f) => f.sev === "ERROR");
const warns = findings.filter((f) => f.sev === "WARN");
for (const f of [...errors, ...warns]) {
  console.log(`${f.sev}  ${f.file}:${f.line}  ${f.rule}  found="${f.found}"  fix: ${f.fix}`);
}
console.log(`\nds-lint: ${errors.length} error(s), ${warns.length} warning(s) over ${files.length} files in ${root}`);
process.exit(errors.length > 0 ? 1 : 0);
