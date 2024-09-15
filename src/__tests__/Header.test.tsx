import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useRouter } from '@/navigation';
import { useMediaQuery } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/contexts/AuthContext/AuthContext');
vi.mock('@/navigation');
vi.mock('@mui/material', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useMediaQuery: vi.fn(),
    useTheme: vi.fn(() => ({ breakpoints: { down: vi.fn() } })),
  };
});
vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

const renderHeaderWithProviders = () => {
  return render(
    <NextIntlClientProvider locale={'en'}>
      <Header />
    </NextIntlClientProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (useMediaQuery as Mock).mockReturnValue(false);
  });

  it('renders GuestNav when user is not authenticated', () => {
    renderHeaderWithProviders();
    expect(screen.getByText('sign-in')).toBeInTheDocument();
    expect(screen.getByText('sign-up')).toBeInTheDocument();
  });

  it('renders AuthenticatedNav when user is authenticated', () => {
    (useAuth as Mock).mockReturnValue({ user: { uid: '123' }, loading: false });
    renderHeaderWithProviders();
    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('rest')).toBeInTheDocument();
    expect(screen.getByText('graphql')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
  });

  it('renders LeftMenu on mobile', () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);
    renderHeaderWithProviders();
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(screen.getByText('app-title')).toBeInTheDocument();
  });

  it('renders LanguageSelect', () => {
    renderHeaderWithProviders();
    expect(screen.getByTestId('select-lang')).toBeInTheDocument();
  });
});
