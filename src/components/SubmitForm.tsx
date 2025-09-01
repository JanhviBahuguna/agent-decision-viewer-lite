'use client';

import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useDecisionStore } from '../store/useDecisionStore';
import { SubmitFormData } from '../types';
import LoadingSpinner from './LoadingSpinner';

export default function SubmitForm() {
  const [formData, setFormData] = useState<SubmitFormData>({
    amount: 0,
    payee: '',
    customerId: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addDecision, setError, loading } = useDecisionStore();
  
  // Debounce form submission to prevent spam
  const debouncedFormData = useDebounce(formData, 300);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !formData.amount || !formData.payee || !formData.customerId) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get decision');
      }

      const result = await response.json();
      const latency = Date.now() - startTime;

      addDecision({
        ...result,
        latency,
        timestamp: new Date(),
      });

      // Reset form
      setFormData({ amount: 0, payee: '', customerId: '' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.amount > 0 && formData.payee.trim() && formData.customerId.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Submit Decision Request</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label htmlFor="payee" className="block text-sm font-medium text-gray-700 mb-1">
            Payee
          </label>
          <input
            id="payee"
            type="text"
            value={formData.payee}
            onChange={(e) => setFormData(prev => ({ ...prev, payee: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter payee name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
            Customer ID
          </label>
          <input
            id="customerId"
            type="text"
            value={formData.customerId}
            onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer ID"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            Processing...
          </>
        ) : (
          'Submit Decision Request'
        )}
      </button>
    </form>
  );
}