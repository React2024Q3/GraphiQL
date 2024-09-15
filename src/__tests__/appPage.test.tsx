import Home from '@/app/[locale]/page';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/MainContent', () => ({
  MainContent: () => <div>Main Content Mock</div>,
}));

describe('Home', () => {
  it('should render the MainContent component', () => {
    render(<Home />);

    expect(screen.getByText('Main Content Mock')).toBeInTheDocument();
  });
});
