import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AGENTS_DIR = process.env.AGENTS_DIR || path.resolve(__dirname, '../../.claude/agents');

const app = express();
app.use(cors());
app.use(express.json());

interface AgentData {
  name: string;
  description: string;
  tools: string;
  enabled: boolean;
  filename: string;
  content: string;
}

function parseAgentFile(filepath: string): AgentData | null {
  try {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data, content } = matter(raw);
    const basename = path.basename(filepath);
    const enabled = !basename.endsWith('.disabled');
    const name = data.name || basename.replace(/\.md(\.disabled)?$/, '');

    return {
      name,
      description: data.description || '',
      tools: data.tools || '',
      enabled,
      filename: basename,
      content: content.trim(),
    };
  } catch {
    return null;
  }
}

function writeAgentFile(name: string, agent: { description: string; tools: string; content: string; enabled: boolean }) {
  const ext = agent.enabled ? '.md' : '.md.disabled';
  const filepath = path.join(AGENTS_DIR, `${name}${ext}`);
  const frontmatter = `---\nname: ${name}\ndescription: ${agent.description}\ntools: ${agent.tools}\n---\n\n${agent.content}\n`;
  fs.writeFileSync(filepath, frontmatter, 'utf-8');
  return filepath;
}

// GET /api/agents — list all agents
app.get('/api/agents', (_req, res) => {
  try {
    if (!fs.existsSync(AGENTS_DIR)) {
      res.json([]);
      return;
    }
    const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.md.disabled'));
    const agents = files.map(f => parseAgentFile(path.join(AGENTS_DIR, f))).filter(Boolean);
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/agents/:name — get single agent
app.get('/api/agents/:name', (req, res) => {
  const { name } = req.params;
  const enabledPath = path.join(AGENTS_DIR, `${name}.md`);
  const disabledPath = path.join(AGENTS_DIR, `${name}.md.disabled`);

  let filepath = '';
  if (fs.existsSync(enabledPath)) filepath = enabledPath;
  else if (fs.existsSync(disabledPath)) filepath = disabledPath;
  else {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  const agent = parseAgentFile(filepath);
  if (!agent) {
    res.status(500).json({ error: 'Failed to parse agent file' });
    return;
  }
  res.json(agent);
});

// POST /api/agents — create new agent
app.post('/api/agents', (req, res) => {
  const { name, description, tools, content } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const enabledPath = path.join(AGENTS_DIR, `${name}.md`);
  const disabledPath = path.join(AGENTS_DIR, `${name}.md.disabled`);
  if (fs.existsSync(enabledPath) || fs.existsSync(disabledPath)) {
    res.status(409).json({ error: 'Agent already exists' });
    return;
  }

  writeAgentFile(name, { description: description || '', tools: tools || '', content: content || '', enabled: true });
  const agent = parseAgentFile(enabledPath);
  res.status(201).json(agent);
});

// PUT /api/agents/:name — update agent
app.put('/api/agents/:name', (req, res) => {
  const { name } = req.params;
  const { description, tools, content } = req.body;

  const enabledPath = path.join(AGENTS_DIR, `${name}.md`);
  const disabledPath = path.join(AGENTS_DIR, `${name}.md.disabled`);

  let currentEnabled = true;
  if (fs.existsSync(enabledPath)) {
    currentEnabled = true;
  } else if (fs.existsSync(disabledPath)) {
    currentEnabled = false;
  } else {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  // Remove old file
  const oldPath = currentEnabled ? enabledPath : disabledPath;
  fs.unlinkSync(oldPath);

  writeAgentFile(name, {
    description: description || '',
    tools: tools || '',
    content: content || '',
    enabled: currentEnabled,
  });

  const newPath = currentEnabled ? enabledPath : disabledPath;
  const agent = parseAgentFile(newPath);
  res.json(agent);
});

// PATCH /api/agents/:name/toggle — toggle enabled/disabled
app.patch('/api/agents/:name/toggle', (req, res) => {
  const { name } = req.params;
  const enabledPath = path.join(AGENTS_DIR, `${name}.md`);
  const disabledPath = path.join(AGENTS_DIR, `${name}.md.disabled`);

  let currentEnabled = true;
  if (fs.existsSync(enabledPath)) {
    currentEnabled = true;
  } else if (fs.existsSync(disabledPath)) {
    currentEnabled = false;
  } else {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  const oldPath = currentEnabled ? enabledPath : disabledPath;
  const newPath = currentEnabled ? disabledPath : enabledPath;
  fs.renameSync(oldPath, newPath);

  const agent = parseAgentFile(newPath);
  res.json(agent);
});

// DELETE /api/agents/:name — delete agent
app.delete('/api/agents/:name', (req, res) => {
  const { name } = req.params;
  const enabledPath = path.join(AGENTS_DIR, `${name}.md`);
  const disabledPath = path.join(AGENTS_DIR, `${name}.md.disabled`);

  let filepath = '';
  if (fs.existsSync(enabledPath)) filepath = enabledPath;
  else if (fs.existsSync(disabledPath)) filepath = disabledPath;
  else {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  fs.unlinkSync(filepath);
  res.json({ deleted: true, name });
});

// In production, serve Vite build
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3501;
app.listen(PORT, () => {
  console.log(`Claude Family API running on http://localhost:${PORT}`);
  console.log(`Agents directory: ${AGENTS_DIR}`);
});
