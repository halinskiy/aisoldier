#!/usr/bin/env node
// orchestra/log.mjs -- append one contribution record to the ledger.
// Called after every subagent invocation so the dashboard can show how
// involved each agent actually is (count, tokens, recency). The
// orchestrator logs this from the Agent result's usage; agents may also
// self-log. One JSON line per call; appends are atomic for small writes.
//
//   node apps/orchestra/log.mjs <agent> <tokens|na> <project> "<task>" [verdict]
//
// Examples:
//   node apps/orchestra/log.mjs 3mpq-judge 18000 corder-landing "review hero" PASSED
//   node apps/orchestra/log.mjs 3mpq-linter na corder-landing "lint hero" block

import { appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(HERE, "data", "contributions.jsonl");

const [agent, tokensRaw, project = "", task = "", verdict = ""] = process.argv.slice(2);
if (!agent) {
  console.error('usage: node log.mjs <agent> <tokens|na> <project> "<task>" [verdict]');
  process.exit(1);
}
const tokens = tokensRaw && tokensRaw !== "na" && !Number.isNaN(Number(tokensRaw)) ? Number(tokensRaw) : null;
const rec = { ts: new Date().toISOString(), agent, tokens, project, task, verdict };

await appendFile(LEDGER, JSON.stringify(rec) + "\n");
console.log("logged:", rec.agent, rec.tokens ?? "n/a", rec.task);
