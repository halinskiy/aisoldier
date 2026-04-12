import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import AgentForm from './components/AgentForm';
import PipelineView from './components/PipelineView';
import Toast from './components/Toast';
import { api } from './lib/api';
import type { Agent } from './lib/types';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadAgents = useCallback(async () => {
    try {
      const data = await api.listAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const showToast = (msg: string) => setToast(msg);

  const handleToggle = async (name: string) => {
    try {
      const updated = await api.toggleAgent(name);
      setAgents((prev) => prev.map((a) => (a.name === name ? updated : a)));
      showToast(updated.enabled ? `${name} enabled` : `${name} disabled`);
    } catch (err) {
      console.error('Toggle failed:', err);
      showToast('Toggle failed');
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setIsCreating(false);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingAgent(null);
    setIsCreating(true);
    setShowForm(true);
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete agent "${name}"? This will remove the .md file.`)) return;
    try {
      await api.deleteAgent(name);
      setAgents((prev) => prev.filter((a) => a.name !== name));
      showToast(`${name} deleted`);
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Delete failed');
    }
  };

  const handleSave = async (data: { name: string; description: string; tools: string; content: string }) => {
    try {
      if (isCreating) {
        const created = await api.createAgent(data);
        setAgents((prev) => [...prev, created]);
        showToast('Agent created');
      } else {
        const updated = await api.updateAgent(data.name, {
          description: data.description,
          tools: data.tools,
          content: data.content,
        });
        setAgents((prev) => prev.map((a) => (a.name === data.name ? updated : a)));
        showToast('Agent updated');
      }
      setShowForm(false);
      setEditingAgent(null);
    } catch (err) {
      console.error('Save failed:', err);
      showToast(`Save failed: ${err}`);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAgent(null);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 80px' }}>
      <Header />

      {/* Pipeline View */}
      <div style={{ marginBottom: 24 }}>
        <PipelineView agents={agents} />
      </div>

      {/* Agent list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
          Loading agents...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              agent={agent}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* New Agent button */}
          <div className="new-agent-card" onClick={handleCreate}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="9" y1="3" x2="9" y2="15" />
              <line x1="3" y1="9" x2="15" y2="9" />
            </svg>
            New Agent
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <AgentForm
          agent={isCreating ? null : editingAgent}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
