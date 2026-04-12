import type { Agent, ToolName } from '../lib/types';

interface AgentCardProps {
  agent: Agent;
  onToggle: (name: string) => void;
  onEdit: (agent: Agent) => void;
  onDelete: (name: string) => void;
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M13 4v9.33a1.33 1.33 0 01-1.33 1.34H4.33A1.33 1.33 0 013 13.33V4" />
    </svg>
  );
}

export default function AgentCard({ agent, onToggle, onEdit, onDelete }: AgentCardProps) {
  const tools = agent.tools
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean) as ToolName[];

  return (
    <div className={`agent-card ${!agent.enabled ? 'disabled' : ''}`}>
      {/* Top row: name left, toggle + edit + delete right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <h3
          style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: 20,
            fontWeight: 600,
            color: '#f4f4f4',
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {agent.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div
            className={`toggle-track ${agent.enabled ? 'active' : ''}`}
            onClick={() => onToggle(agent.name)}
            role="switch"
            aria-checked={agent.enabled}
            aria-label={`Toggle ${agent.name}`}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(agent.name); } }}
          >
            <div className="toggle-thumb" />
          </div>
          <button
            className="icon-btn"
            onClick={() => onEdit(agent)}
            title="Edit agent"
            aria-label="Edit agent"
          >
            <PencilIcon />
          </button>
          <button
            className="icon-btn danger"
            onClick={() => onDelete(agent.name)}
            title="Delete agent"
            aria-label="Delete agent"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {agent.description}
      </p>

      {/* Bottom row: chips left, filepath right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1, minWidth: 0 }}>
          {tools.map((tool) => (
            <span key={tool} className="tool-pill">
              {tool}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'nowrap', flexShrink: 0 }}>
          .claude/agents/{agent.filename}
        </span>
      </div>
    </div>
  );
}
