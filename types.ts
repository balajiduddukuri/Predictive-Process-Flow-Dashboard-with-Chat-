export interface ProcessNode {
  id: string;
  label: string;
  type: 'activity' | 'decision' | 'document' | 'milestone' | 'group';
  description?: string;
  subItems?: ProcessNode[];
}

export interface ProcessPhase {
  id: string;
  title: string;
  color: string;
  borderColor: string;
  textColor: string;
  nodes: ProcessNode[];
}

export interface AIResponse {
  summary: string;
  checklist: string[];
  tips: string;
}
