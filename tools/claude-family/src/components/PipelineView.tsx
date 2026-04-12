import type { Agent } from '../lib/types';
import { PIPELINE_ORDER } from '../lib/types';

interface PipelineViewProps {
  agents: Agent[];
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="4.5" r="3" />
      <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6H2z" />
    </svg>
  );
}

export default function PipelineView({ agents }: PipelineViewProps) {
  const agentMap = new Map(agents.map((a) => [a.name, a]));

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-window)',
        padding: '20px 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <p
        style={{
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: 20,
          fontWeight: 600,
          color: '#f4f4f4',
          lineHeight: 1.25,
          margin: 0,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Pipeline Flow
      </p>
      <div
        className="pipeline-flow"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0,
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        {PIPELINE_ORDER.map((step, i) => {
          const agent = agentMap.get(step.name);
          const isActive = agent?.enabled ?? false;

          return (
            <div key={step.name} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <div className="pipeline-connector" />}
              <div className={`pipeline-node ${isActive ? 'active' : 'disabled'}`}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isActive ? '#0f62fe' : '#555',
                    flexShrink: 0,
                  }}
                />
                {step.label}
              </div>
            </div>
          );
        })}

        {/* Line to User */}
        <div className="pipeline-connector" />
        <div className="pipeline-node active">
          <PersonIcon />
          User
        </div>
      </div>
    </div>
  );
}
