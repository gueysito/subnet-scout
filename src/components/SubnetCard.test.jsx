/**
 * Unit Tests for SubnetCard Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubnetCard from './SubnetCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  TrendingUp: () => <span data-testid="trending-up-icon">📈</span>,
  TrendingDown: () => <span data-testid="trending-down-icon">📉</span>,
  Minus: () => <span data-testid="minus-icon">➖</span>,
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  EyeOff: () => <span data-testid="eye-off-icon">🙈</span>,
  Activity: () => <span data-testid="activity-icon">📊</span>,
  Shield: () => <span data-testid="shield-icon">🛡️</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
  Github: () => <span data-testid="github-icon">🐙</span>,
  ExternalLink: () => <span data-testid="external-link-icon">🔗</span>,
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('SubnetCard', () => {
  const mockAgent = {
    id: 42,
    subnet_id: 42,
    name: 'Test Subnet',
    description: 'A test subnet for unit testing',
    type: 'AI Processing',
    status: 'healthy',
    score: 85.5,
    yield: 12.3,
    activity: 78,
    credibility: 92,
    emission_rate: 1.5,
    total_stake: 15000000,
    validator_count: 256,
    github_url: 'https://github.com/test/subnet',
    last_updated: '2024-01-15T10:30:00Z'
  };

  const defaultProps = {
    agent: mockAgent,
    onScoreClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders subnet information correctly', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Subnet')).toBeInTheDocument();
    expect(screen.getByText('A test subnet for unit testing')).toBeInTheDocument();
    expect(screen.getByText('AI Processing')).toBeInTheDocument();
    expect(screen.getByText('85.5')).toBeInTheDocument();
  });

  it('displays correct status styling for healthy subnet', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    const statusBadge = screen.getByText('Healthy');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-emerald-500');
  });

  it('displays correct status styling for warning subnet', () => {
    const warningAgent = { ...mockAgent, status: 'warning', score: 45 };
    render(<SubnetCard agent={warningAgent} />, { wrapper: TestWrapper });

    const statusBadge = screen.getByText('Warning');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-amber-500');
  });

  it('displays correct status styling for critical subnet', () => {
    const criticalAgent = { ...mockAgent, status: 'critical', score: 25 };
    render(<SubnetCard agent={criticalAgent} />, { wrapper: TestWrapper });

    const statusBadge = screen.getByText('Critical');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-red-500');
  });

  it('calls onScoreClick when analyze button is clicked', () => {
    const onScoreClick = vi.fn();
    render(<SubnetCard {...defaultProps} onScoreClick={onScoreClick} />, { wrapper: TestWrapper });

    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    expect(onScoreClick).toHaveBeenCalledWith(42);
  });

  it('toggles extended view when show more button is clicked', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    // Initially should show "More" button
    const moreButton = screen.getByText('More');
    expect(moreButton).toBeInTheDocument();

    // Click to expand
    fireEvent.click(moreButton);

    // Should now show "Less" button
    expect(screen.getByText('Less')).toBeInTheDocument();

    // Should show extended information
    expect(screen.getByText('Emission Rate')).toBeInTheDocument();
    expect(screen.getByText('Total Stake')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    // Expand to see extended view
    fireEvent.click(screen.getByText('More'));

    // Check if stake is formatted (15M from 15000000)
    expect(screen.getByText('15.00M')).toBeInTheDocument();
  });

  it('handles missing optional properties gracefully', () => {
    const minimalAgent = {
      id: 1,
      subnet_id: 1,
      name: 'Minimal Subnet',
      status: 'healthy',
      score: 50
    };

    render(<SubnetCard agent={minimalAgent} />, { wrapper: TestWrapper });

    expect(screen.getByText('Minimal Subnet')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('shows github link when available', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    // Expand to see github link
    fireEvent.click(screen.getByText('More'));

    const githubLink = screen.getByTestId('github-icon').closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/subnet');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('handles missing github url gracefully', () => {
    const agentWithoutGithub = { ...mockAgent, github_url: undefined };
    render(<SubnetCard agent={agentWithoutGithub} />, { wrapper: TestWrapper });

    // Expand to see extended view
    fireEvent.click(screen.getByText('More'));

    // Should not show github link
    expect(screen.queryByTestId('github-icon')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    const analyzeButton = screen.getByText('Analyze');
    expect(analyzeButton).toHaveAttribute('aria-label', 'Analyze subnet Test Subnet');

    const moreButton = screen.getByText('More');
    expect(moreButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates aria-expanded when toggling extended view', () => {
    render(<SubnetCard {...defaultProps} />, { wrapper: TestWrapper });

    const moreButton = screen.getByText('More');
    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(moreButton);

    const lessButton = screen.getByText('Less');
    expect(lessButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('displays yield trend indicator correctly', () => {
    const agentWithPositiveYield = { ...mockAgent, yield_change_24h: 2.5 };
    render(<SubnetCard agent={agentWithPositiveYield} />, { wrapper: TestWrapper });

    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
  });

  it('displays negative yield trend correctly', () => {
    const agentWithNegativeYield = { ...mockAgent, yield_change_24h: -1.8 };
    render(<SubnetCard agent={agentWithNegativeYield} />, { wrapper: TestWrapper });

    expect(screen.getByTestId('trending-down-icon')).toBeInTheDocument();
    expect(screen.getByText('-1.8%')).toBeInTheDocument();
  });
});