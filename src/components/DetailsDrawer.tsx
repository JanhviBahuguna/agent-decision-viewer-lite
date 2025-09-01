'use client';

import { useEffect, useRef, useState } from 'react';
import { useDecisionStore } from '../store/useDecisionStore';
import { maskCustomerId } from '../utils/maskCustomerId';

export default function DetailsDrawer() {
  const { selectedDecision, setSelectedDecision } = useDecisionStore();
  const [isTraceExpanded, setIsTraceExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management and keyboard trap
  useEffect(() => {
    if (selectedDecision) {
      // Focus the close button when drawer opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // Trap focus within drawer
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
        
        if (e.key === 'Tab') {
          const drawer = drawerRef.current;
          if (!drawer) return;

          const focusableElements = drawer.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedDecision]);

  const handleClose = () => {
    setSelectedDecision(null);
    setIsTraceExpanded(false);
  };

  if (!selectedDecision) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        ref={drawerRef}
        className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 id="drawer-title" className="text-lg font-semibold">
              Decision Details
            </h3>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close details drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Decision:</span>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedDecision.decision === 'APPROVE' 
                      ? 'bg-green-100 text-green-800'
                      : selectedDecision.decision === 'DECLINE'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedDecision.decision}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <div className="mt-1">${selectedDecision.amount.toFixed(2)}</div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Customer ID:</span>
                <div className="mt-1 font-mono">{maskCustomerId(selectedDecision.customerId)}</div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Latency:</span>
                <div className="mt-1">{selectedDecision.latency}ms</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Reasons</h4>
              <ul className="space-y-1" role="list">
                {selectedDecision.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <button
                onClick={() => setIsTraceExpanded(!isTraceExpanded)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                aria-expanded={isTraceExpanded}
                aria-controls="agent-trace"
              >
                <span>Agent Trace</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${isTraceExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isTraceExpanded && (
                <div id="agent-trace" className="mt-2 space-y-2">
                  {selectedDecision.agentTrace.map((step, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-800">{step.step}</span>
                        <span className="text-xs text-gray-500">{step.duration}ms</span>
                      </div>
                      <p className="text-xs text-gray-600">{step.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}