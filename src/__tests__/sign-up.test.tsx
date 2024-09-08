import SignUp from '@/app/[locale]/sign-up/page';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { registerWithEmailAndPassword } from '@/firebase/utils';
import { useRouter } from '@/navigation';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { Mock, vi } from 'vitest';

vi.mock('@/contexts/AuthContext/AuthContext');
vi.mock('@/firebase/utils');
vi.mock('@/navigation');
vi.mock('next-intl');
vi.mock('@/components/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

describe('SignUp', () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false, error: null });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (useTranslations as Mock).mockReturnValue((key: string) => key);
  });

  it('should render Loader when loading is true', async () => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: true, error: null });

    render(<SignUp />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders sign up form', () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/auth\.name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auth\.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auth\.password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auth\.confirm-password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttons.sign-up' })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    (registerWithEmailAndPassword as Mock).mockResolvedValue(undefined);

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/auth\.name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/auth\.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.confirm-password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'buttons.sign-up' }));

    await waitFor(() => {
      expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'Password123!'
      );
    });
  });

  it('displays error message on invalid submission', async () => {
    (registerWithEmailAndPassword as Mock).mockRejectedValue(new Error('Registration failed'));

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/auth\.name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/auth\.email/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.confirm-password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'buttons.sign-up' }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('redirects to home page when user is already logged in', () => {
    const replaceMock = vi.fn();
    (useAuth as Mock).mockReturnValue({ user: { uid: '123' }, loading: false, error: null });
    (useRouter as Mock).mockReturnValue({ replace: replaceMock });

    render(<SignUp />);

    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
