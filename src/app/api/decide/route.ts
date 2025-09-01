import { NextRequest, NextResponse } from 'next/server';
import { Decision } from '../../../types';

const mockReasons = [
  'Transaction amount within normal range',
  'Customer has good payment history',
  'Fraud risk score below threshold',
  'Payee verified in system',
  'Geographic location matches profile',
];

const mockAgentSteps = [
  { step: 'Risk Assessment', duration: 45, details: 'Evaluated transaction risk using ML models' },
  { step: 'Fraud Detection', duration: 23, details: 'Checked against known fraud patterns' },
  { step: 'Customer Verification', duration: 67, details: 'Validated customer identity and status' },
  { step: 'Policy Check', duration: 12, details: 'Applied business rules and policies' },
  { step: 'Final Decision', duration: 8, details: 'Generated final decision based on all factors' },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, payee, customerId } = body;

    // Simulate processing time
    const processingTime = Math.random() * 400 + 100; // 100-500ms
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Mock decision logic
    const decision: 'APPROVE' | 'DECLINE' | 'REVIEW' = 
      amount > 10000 ? 'REVIEW' :
      amount > 5000 ? (Math.random() > 0.3 ? 'APPROVE' : 'DECLINE') :
      'APPROVE';

    const result: Omit<Decision, 'latency' | 'timestamp'> = {
      id: `dec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      decision,
      amount,
      customerId,
      reasons: mockReasons.slice(0, Math.floor(Math.random() * 3) + 2),
      agentTrace: mockAgentSteps.slice(0, Math.floor(Math.random() * 3) + 3),
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process decision request' },
      { status: 500 }
    );
  }
}