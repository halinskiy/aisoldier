import type { Agent } from './types';

const BASE = '/api';

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  listAgents: () => request<Agent[]>('/agents'),

  getAgent: (name: string) => request<Agent>(`/agents/${encodeURIComponent(name)}`),

  createAgent: (data: { name: string; description: string; tools: string; content: string }) =>
    request<Agent>('/agents', { method: 'POST', body: JSON.stringify(data) }),

  updateAgent: (name: string, data: { description: string; tools: string; content: string }) =>
    request<Agent>(`/agents/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleAgent: (name: string) =>
    request<Agent>(`/agents/${encodeURIComponent(name)}/toggle`, { method: 'PATCH' }),

  deleteAgent: (name: string) =>
    request<{ deleted: boolean; name: string }>(`/agents/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),
};
