export type RelationshipType = 
  | 'direct-report'
  | 'matrix'
  | 'collaborative'
  | 'advisory';

export interface NodeData {
  title: string;
  description: string;
  member?: {
    name: string;
    email: string;
    status: string;
    role: string;
    startDate: string;
    teams: string[];
  };
  department: string;
  reportsTo: string;
  relationships: {
    type: RelationshipType;
    with: string;
    description: string;
  }[];
  kpis?: {
    name: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
  isCollapsed?: boolean;
  isHighlighted?: boolean;
  isLoading?: boolean;
} 