import { create } from 'zustand';
import { Decision, DecisionStore } from '../types';

const MAX_DECISIONS = 20;

export const useDecisionStore = create<DecisionStore>((set) => ({
  decisions: [],
  loading: false,
  error: null,
  selectedDecision: null,
  
  addDecision: (decision: Decision) =>
    set((state) => ({
      decisions: [decision, ...state.decisions].slice(0, MAX_DECISIONS),
      error: null,
    })),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  setSelectedDecision: (decision: Decision | null) => 
    set({ selectedDecision: decision }),
}));