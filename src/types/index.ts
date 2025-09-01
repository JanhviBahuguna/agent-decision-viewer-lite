export interface Decision {
  id: string;
  decision: 'APPROVE' | 'DECLINE' | 'REVIEW';
  amount: number;
  customerId: string;
  latency: number;
  reasons: string[];
  agentTrace: AgentStep[];
  timestamp: Date;
}

export interface AgentStep {
  step: string;
  duration: number;
  details: string;
}

export interface SubmitFormData {
  amount: number;
  payee: string;
  customerId: string;
}

export interface DecisionStore {
  decisions: Decision[];
  loading: boolean;
  error: string | null;
  selectedDecision: Decision | null;
  addDecision: (decision: Decision) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDecision: (decision: Decision | null) => void;
}