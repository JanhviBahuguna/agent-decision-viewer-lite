'use client';

import { useDecisionStore } from '../store/useDecisionStore';
import { maskCustomerId } from '../utils/maskCustomerId';
import { Decision } from '../types';

export default function ResultsTable() {
  const { decisions, setSelectedDecision, loading } = useDecisionStore();

  const handleRowClick = (decision: Decision) => {
    setSelectedDecision(decision);
  };

  if (loading && decisions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <p className="text-gray-500 text-lg">No data yet</p>
        <p className="text-gray-400 text-sm mt-1">Submit a decision request to see results</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Decisions (Last 20)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Decision</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Amount</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Customer ID</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Latency (ms)</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((decision) => (
                <tr
                  key={decision.id}
                  onClick={() => handleRowClick(decision)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none"
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for decision ${decision.decision}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(decision);
                    }
                  }}
                >
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      decision.decision === 'APPROVE' 
                        ? 'bg-green-100 text-green-800'
                        : decision.decision === 'DECLINE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {decision.decision}
                    </span>
                  </td>
                  <td className="py-3 px-3">${decision.amount.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono text-sm">{maskCustomerId(decision.customerId)}</td>
                  <td className="py-3 px-3">{decision.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}