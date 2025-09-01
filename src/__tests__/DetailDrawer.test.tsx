import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailsDrawer from '../components/DetailsDrawer';
import { useDecisionStore } from '../store/useDecisionStore';
import { Decision } from '../types';

// Mock the store
jest.mock('../store/useDecisionStore');

const mockDecision: Decision = {
  id: 'test-1',
  decision: 'APPROVE',
  amount: 1000,
  customerId: 'cust123456',
  latency: 150,
  reasons: ['Good payment history', 'Low fraud risk'],
  agentTrace: [
    { step: 'Risk Assessment', duration: 45, details: 'Evaluated risk factors' },
    { step: 'Policy Check', duration: 32, details: 'Applied business rules' },
  ],
  timestamp: new Date(),
};

const mockStore = {
  decisions: [],
  loading: false,
  error: null,
  selectedDecision: null,
  addDecision: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  setSelectedDecision: jest.fn(),
};

describe('DetailsDrawer', () => {
  beforeEach(() => {
    (useDecisionStore as jest.Mock).mockReturnValue(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when no decision is selected', () => {
    render(<DetailsDrawer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders decision details when decision is selected', () => {
    (useDecisionStore as jest.Mock).mockReturnValue({
      ...mockStore,
      selectedDecision: mockDecision,
    });

    render(<DetailsDrawer />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Decision Details')).toBeInTheDocument();
    expect(screen.getByText('APPROVE')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('***456')).toBeInTheDocument();
  });

  it('expands and shows agent trace steps when clicked', async () => {
    const user = userEvent.setup();
    (useDecisionStore as jest.Mock).mockReturnValue({
      ...mockStore,
      selectedDecision: mockDecision,
    });

    render(<DetailsDrawer />);
    
    const traceButton = screen.getByRole('button', { name: /agent trace/i });
    expect(traceButton).toHaveAttribute('aria-expanded', 'false');
    
    await user.click(traceButton);
    
    expect(traceButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Policy Check')).toBeInTheDocument();
    expect(screen.getByText('Evaluated risk factors')).toBeInTheDocument();
  });

  it('closes drawer when escape key is pressed', async () => {
    const user = userEvent.setup();
    (useDecisionStore as jest.Mock).mockReturnValue({
      ...mockStore,
      selectedDecision: mockDecision,
    });

    render(<DetailsDrawer />);
    
    await user.keyboard('{Escape}');
    
    expect(mockStore.setSelectedDecision).toHaveBeenCalledWith(null);
  });

  it('focuses close button when drawer opens', async () => {
    (useDecisionStore as jest.Mock).mockReturnValue({
      ...mockStore,
      selectedDecision: mockDecision,
    });

    render(<DetailsDrawer />);
    
    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close details drawer');
      expect(closeButton).toHaveFocus();
    });
  });
});