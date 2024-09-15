import { RDTGraphiQLResponseEditor } from '@/components/GraphiQLForm/RDTGraphiQLResponseEditor';
import { GraphiQLProvider } from '@graphiql/react';
import { Fetcher } from '@graphiql/toolkit';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

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

vi.mock('@graphiql/react', () => ({
  __esModule: true,
  ResponseEditor: ({ onEdit }: { onEdit: (v: string) => void }) => (
    <textarea data-testid='response-editor-mock' onChange={(e) => onEdit(e.target.value)} />
  ),
  GraphiQLProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='graphiql-provider-mock'>{children}</div>
  ),
  Spinner: () => <div data-testid='spinner-mock'>Spinner spinning...</div>,
}));

const noOpFetcher: Fetcher = () => {
  return {};
};

const renderWithGraphiQLProvider = (ui: React.ReactElement) => {
  return render(<GraphiQLProvider fetcher={noOpFetcher}>{ui}</GraphiQLProvider>);
};

describe('RDTGraphiQLResponseEditor', () => {
  it('renders correctly', () => {
    renderWithGraphiQLProvider(<RDTGraphiQLResponseEditor isFetching={false} />);
    expect(screen.getByTestId('graphiql-provider-mock')).toBeInTheDocument();
    expect(screen.getByTestId('response-editor-mock')).toBeInTheDocument();
  });

  it('displays status', () => {
    renderWithGraphiQLProvider(
      <RDTGraphiQLResponseEditor isFetching={false} responseStatus={200} />
    );

    expect(screen.getByText(/status: 200/)).toBeInTheDocument();
  });

  it('shows loader and spinner when isFetching is true', () => {
    renderWithGraphiQLProvider(<RDTGraphiQLResponseEditor isFetching={true} />);
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    expect(screen.getByText(/Spinner spinning.../)).toBeInTheDocument();
  });
});
