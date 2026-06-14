# Orchestra

A tiny localhost service that lists every agent in the Aisoldier
ensemble. Zero dependencies (Node built-in `http` only). It reads the
real agent definitions from `.claude/agents/*.md` at request time, so it
always reflects the live roster: add or edit an agent and just refresh.

## Run

```
node apps/orchestra/server.mjs
# then open http://localhost:7777

PORT=8080 node apps/orchestra/server.mjs   # custom port
```

## What it shows

- **Pipeline** - order of play from request to deploy, with the judge
  gate and the ISSUES loop.
- **The 3mpq orchestra** - the eight chairs (dispatcher, researcher,
  economist, copywriter, soldier, judge, inquisitor, devops). Role,
  model badge, what each writes to, and the tool set, with descriptions
  and tools read live from the agent files.
- **Built-in agents** - general-purpose, Explore, Plan, claude,
  claude-code-guide, statusline-setup.

## Endpoints

- `/` - the rendered page.
- `/agents.json` - the same roster as JSON.

## Source of truth

Orchestra agents come from `Aisoldier/.claude/agents/*.md` (frontmatter:
`name`, `description`, `tools`, `model`). The pipeline stage, role line,
and "writes to" come from a small curated map in `server.mjs` (doctrine
context that is not in the frontmatter). Built-in agents are listed in
`server.mjs`. Keep it ASCII-only, per studio discipline.
