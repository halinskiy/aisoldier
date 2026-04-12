export interface Agent {
  name: string;
  description: string;
  tools: string;
  enabled: boolean;
  filename: string;
  content: string;
}

export const AVAILABLE_TOOLS = [
  'Read',
  'Write',
  'Edit',
  'Glob',
  'Grep',
  'Bash',
  'WebFetch',
  'WebSearch',
  'Agent',
] as const;

export type ToolName = (typeof AVAILABLE_TOOLS)[number];

export const PIPELINE_ORDER = [
  { name: '3mpq-researcher', step: 1, label: 'Research' },
  { name: '3mpq-soldier', step: 2, label: 'Build' },
  { name: '3mpq-judge', step: 3, label: 'Review' },
] as const;
