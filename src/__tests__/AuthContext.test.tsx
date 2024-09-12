import { AuthProvider, useAuth } from '@/contexts/AuthContext/AuthContext';
import { render, renderHook, screen } from '@testing-library/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Mock, describe, expect, it, vi } from 'vitest';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

describe('AuthProvider', () => {
  it('provides the correct auth context when a user is authenticated', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (useAuthState as Mock).mockReturnValue([mockUser, false, null]);

    const TestComponent = () => {
      const { user, loading, error } = useAuth();
      return (
        <div>
          <span>{user?.email}</span>
          <span>{loading ? 'Loading' : 'Not Loading'}</span>
          <span>{error ? 'Error' : 'No Error'}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Not Loading')).toBeInTheDocument();
    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  it('provides loading state correctly', () => {
    (useAuthState as Mock).mockReturnValue([null, true, null]);

    const TestComponent = () => {
      const { loading } = useAuth();
      return <span>{loading ? 'Loading' : 'Not Loading'}</span>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('provides error state correctly', () => {
    const mockError = new Error('Auth error');
    (useAuthState as Mock).mockReturnValue([null, false, mockError]);

    const TestComponent = () => {
      const { error } = useAuth();
      return <span>{error ? 'Error' : 'No Error'}</span>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});

describe('useAuth Hook', () => {
  it('throws an error if used outside the AuthProvider', () => {
    try {
      renderHook(() => useAuth());
    } catch (e) {
      expect(e).toEqual(new Error('useAuth must be used within an AuthProvider'));
    }
  });
});
