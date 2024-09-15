import RDTGraphiQLDocExplorer from '@/components/GraphiQLForm/RDTGraphiQLDocExplorer';
import { GraphiQLProvider } from '@graphiql/react';
import { Fetcher } from '@graphiql/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
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

vi.mock('@/data/serverActions/getSchema', () => ({
  getSchema: () => ({ schema: 'InValidSchema' }),
}));

vi.mock('@graphiql/react', () => ({
  __esModule: true,
  DocExplorer: () => <textarea data-testid='docexplorer-editor-mock' />,
  GraphiQLProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='graphiql-provider-mock'>{children}</div>
  ),
  Spinner: () => <div data-testid='spinner-mock'>Spinner spinning...</div>,
}));

const noOpFetcher: Fetcher = () => {
  return {};
};

const renderWithGraphiQLProvider = () => {
  return render(
    <GraphiQLProvider fetcher={noOpFetcher}>
      <RDTGraphiQLDocExplorer baseURL='https://test.com' onCustomSchemaFetch={() => {}} />
    </GraphiQLProvider>
  );
};

describe('RDTGraphiQLDocExplorer', () => {
  it('renders without crashing', () => {
    renderWithGraphiQLProvider();
  });

  it('displays the correct SDL Url', async () => {
    renderWithGraphiQLProvider();

    const input = screen.getAllByRole('textbox')[0];
    expect(input).toHaveAttribute('value', 'https://test.com?sdl');
  });

  it('renders Spinner and Loading components when fetchSDLButton is clicked', async () => {
    renderWithGraphiQLProvider();

    const fetchSDLButton = screen.getByRole('button', { name: /fetchSDLButton/i });
    await fireEvent.click(fetchSDLButton);

    expect(screen.getByTestId('spinner-mock')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
