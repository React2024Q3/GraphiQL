import SignIn from '@/app/[locale]/sign-in/page';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logInWithEmailAndPassword } from '@/firebase/utils';
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

describe('SignIn', () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false, error: null });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (useTranslations as Mock).mockReturnValue((key: string) => key);
  });

  it('should render Loader when loading is true', async () => {
    (useAuth as Mock).mockReturnValue({ loading: true, error: null });

    render(<SignIn />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders sign in form', () => {
    render(<SignIn />);
    expect(screen.getByRole('textbox', { name: 'auth.email' })).toBeInTheDocument();
    expect(screen.getByLabelText(/auth\.password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttons.sign-in' })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    (logInWithEmailAndPassword as Mock).mockResolvedValue(undefined);

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/auth\.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'buttons.sign-in' }));

    await waitFor(() => {
      expect(logInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'Password123!');
    });
  });

  it('displays error message on invalid submission', async () => {
    (logInWithEmailAndPassword as Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/auth\.email/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/auth\.password/i), {
      target: { value: 'Aa1234567!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'buttons.sign-in' }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('redirects to home page when user is already logged in', () => {
    const replaceMock = vi.fn();
    (useAuth as Mock).mockReturnValue({ user: { uid: '123' }, loading: false, error: null });
    (useRouter as Mock).mockReturnValue({ replace: replaceMock });

    render(<SignIn />);

    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
