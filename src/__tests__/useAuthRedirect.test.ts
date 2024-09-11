import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Mock, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('useAuthRedirect', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not redirect when downloading', () => {
    (useAuth as Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    renderHook(() => useAuthRedirect());

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('must redirect to the main page if the user is not authorized', () => {
    (useAuth as Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    renderHook(() => useAuthRedirect());

    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('should not redirect if the user is authorized', () => {
    (useAuth as Mock).mockReturnValue({
      user: { id: 1, name: 'User' },
      loading: false,
      error: null,
    });

    renderHook(() => useAuthRedirect());

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
