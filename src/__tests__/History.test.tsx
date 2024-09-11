import History from '@/app/[locale]/history/page';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import urlToRequestTransform from '@/utils/urlToRequestTransform';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Mock, vi } from 'vitest';

vi.mock('@/shared/hooks/useAuthRedirect');
vi.mock('@/shared/hooks/useHistoryLS');
vi.mock('@/utils/urlToRequestTransform');
vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});
vi.mock('@/components/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

const renderHistoryWithProviders = () => {
  return render(
    <NextIntlClientProvider locale={'en'}>
      <History />
    </NextIntlClientProvider>
  );
};

describe('History Component', () => {
  const mockUseAuthRedirect = useAuthRedirect as Mock;
  const mockUseHistoryLS = useHistoryLS as Mock;
  const mockUrlToRequestTransform = urlToRequestTransform as Mock;

  beforeEach(() => {
    mockUseAuthRedirect.mockReturnValue({ loading: false, error: null });
    mockUseHistoryLS.mockReturnValue([[]]);
    mockUrlToRequestTransform.mockImplementation((url) => ({ url, method: 'GET' }));
  });

  it('renders Loader when loading is true', () => {
    mockUseAuthRedirect.mockReturnValue({ loading: true, error: null });
    render(<History />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty history message when there is no history', () => {
    renderHistoryWithProviders();

    expect(screen.getByText('empty-1')).toBeInTheDocument();
    expect(screen.getByText('empty-2')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders history items as links when history is available', () => {
    mockUseHistoryLS.mockReturnValue([['/api/getData', '/api/postData']]);

    renderHistoryWithProviders();

    expect(screen.getByText('GET /api/getData')).toBeInTheDocument();
    expect(screen.getByText('GET /api/postData')).toBeInTheDocument();
  });

  it('renders ErrorNotification when there is an error', () => {
    mockUseAuthRedirect.mockReturnValue({ loading: false, error: 'Some error occurred' });

    renderHistoryWithProviders();

    expect(screen.getByText('Some error occurred')).toBeInTheDocument();
  });
});
