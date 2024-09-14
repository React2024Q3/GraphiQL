import { ErrorBoundary } from '@/components/ErrorBoundary';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

const renderProblemChild = () => {
  const ProblemChild = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ProblemChild />
    </ErrorBoundary>
  );
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should render ErrorPage when there is an error', () => {
    renderProblemChild();

    expect(screen.getByText('errors.error-page-msg')).toBeInTheDocument();
  });
});
