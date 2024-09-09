import { MainContent } from '@/components/MainContent';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/MainContent/WelcomeSection', () => ({
  WelcomeSection: () => <div>Welcome Section Mock</div>,
}));

vi.mock('@/components/MainContent/ProjectSection', () => ({
  ProjectSection: () => <div>Project Section Mock</div>,
}));

vi.mock('@/components/MainContent/Developers', () => ({
  Developers: () => <div>Developers Mock</div>,
}));

vi.mock('@/components/MainContent/CourseSection', () => ({
  CourseSection: () => <div>Course Section Mock</div>,
}));

vi.mock('@/components/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

vi.mock('@/components/ErrorNotification', () => ({
  ErrorNotification: ({ error }: { error: string }) => <div>{error ? error : null}</div>,
}));

describe('MainContent', () => {
  it('should render Loader when loading is true', async () => {
    (useAuth as Mock).mockReturnValue({ loading: true, error: null });

    render(<MainContent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render ErrorNotification when there is an error', () => {
    const error = 'An error occurred';
    (useAuth as Mock).mockReturnValue({ loading: false, error });

    render(<MainContent />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should render all sections when not loading and no error', () => {
    (useAuth as Mock).mockReturnValue({ loading: false, error: null });

    render(<MainContent />);

    expect(screen.getByText('Welcome Section Mock')).toBeInTheDocument();
    expect(screen.getByText('Project Section Mock')).toBeInTheDocument();
    expect(screen.getByText('Developers Mock')).toBeInTheDocument();
    expect(screen.getByText('Course Section Mock')).toBeInTheDocument();
  });

  it('should not render ErrorNotification when error is null', () => {
    (useAuth as Mock).mockReturnValue({ loading: false, error: null });

    render(<MainContent />);

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });
});
