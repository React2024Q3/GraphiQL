import RestTabs from '@/components/RestTabs';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('RestTabs Component', () => {
  it('should render the tabs with correct labels', () => {
    const setTabIndex = vi.fn();
    const tabIndex = 0;

    render(<RestTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />);

    expect(screen.getByText('client.headers')).toBeInTheDocument();
    expect(screen.getByText('client.variables')).toBeInTheDocument();
  });

  it('should call setTabIndex with the new tab index when a tab is clicked', () => {
    const setTabIndex = vi.fn();
    const tabIndex = 0;

    render(<RestTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />);

    fireEvent.click(screen.getByText('client.variables'));

    expect(setTabIndex).toHaveBeenCalledWith(1);
  });

  it('should set the active tab index correctly', () => {
    const setTabIndex = vi.fn();
    const tabIndex = 1;
    render(<RestTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />);

    expect(screen.getByText('client.headers')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('client.variables')).toHaveAttribute('aria-selected', 'true');
  });
});
