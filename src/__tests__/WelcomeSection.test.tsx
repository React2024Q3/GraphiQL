import { WelcomeSection } from '@/components/MainContent/WelcomeSection';
import { getWelcomeString } from '@/components/MainContent/WelcomeSection/helpers';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { fetchUserName } from '@/firebase/utils';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Mock, vi } from 'vitest';

vi.mock('@/contexts/AuthContext/AuthContext');
vi.mock('@/firebase/utils');
vi.mock('@/components/MainContent/WelcomeSection/helpers');
vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

const renderWithProviders = () => {
  return render(
    <NextIntlClientProvider locale={'en'}>
      <WelcomeSection />
    </NextIntlClientProvider>
  );
};

describe('WelcomeSection Component', () => {
  const mockUseAuth = useAuth as Mock;
  const mockFetchUserName = fetchUserName as Mock;
  const mockGetWelcomeString = getWelcomeString as Mock;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null });
    mockFetchUserName.mockImplementation((_user, setName) => setName(''));
    mockGetWelcomeString.mockReturnValue('Welcome');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with no user', () => {
    renderWithProviders();

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Main page picture' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders with a user and displays user name', () => {
    mockUseAuth.mockReturnValue({ user: { uid: '123', email: 'test@example.com' } });
    mockFetchUserName.mockImplementation((_user, setName) => setName('John Doe'));
    mockGetWelcomeString.mockReturnValue('Welcome John Doe');

    renderWithProviders();

    expect(screen.getByText('Welcome John Doe')).toBeInTheDocument();
  });

  it('displays error message when fetchUserName fails', () => {
    const mockError = new Error('Failed to fetch username');
    mockFetchUserName.mockImplementation(() => {
      throw mockError;
    });

    renderWithProviders();

    expect(screen.getByText('Failed to fetch username')).toBeInTheDocument();
  });

  it('displays the image with correct alt text', () => {
    renderWithProviders();

    const image = screen.getByRole('img', { name: 'Main page picture' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/main.png');
    expect(image).toHaveAttribute('alt', 'Main page picture');
  });
});
