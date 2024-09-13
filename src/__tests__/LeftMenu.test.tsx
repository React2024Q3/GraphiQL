import { AUTH_NAV_LINKS, GUEST_NAV_LINKS } from '@/components/Header/constants';
import { LeftMenu } from '@/components/LeftMenu';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logout } from '@/firebase/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/firebase/utils', () => ({
  logout: vi.fn(),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

const renderLeftMenu = () => {
  render(<LeftMenu />);
  const menuButton = screen.getByRole('button', { name: /menu/i });
  fireEvent.click(menuButton);
};

describe('LeftMenu component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should display authenticated user links when a user exists', () => {
    (useAuth as Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com' },
    });

    renderLeftMenu();

    AUTH_NAV_LINKS.forEach((link) => {
      expect(screen.getByText(`buttons.${link.key}`)).toBeInTheDocument();
    });

    expect(screen.getByText('buttons.sign-out')).toBeInTheDocument();
  });

  test('should display guest links when there is no user', () => {
    (useAuth as Mock).mockReturnValue({
      user: null,
    });

    renderLeftMenu();

    GUEST_NAV_LINKS.forEach((link) => {
      expect(screen.getByText(`buttons.${link.key}`)).toBeInTheDocument();
    });

    expect(screen.queryByText('buttons.sign-out')).not.toBeInTheDocument();
  });

  test('should call logout when the sign-out button is clicked', () => {
    (useAuth as Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com' },
    });

    renderLeftMenu();

    const logoutButton = screen.getByText('buttons.sign-out');
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
