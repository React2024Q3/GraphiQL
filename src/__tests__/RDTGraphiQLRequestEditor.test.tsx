import { RDTGraphiQLRequestEditor } from '@/components/GraphiQLForm/RDTGraphiQLRequestEditor';
import { GraphiQLProvider } from '@graphiql/react';
import { Fetcher } from '@graphiql/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@graphiql/react', () => ({
  __esModule: true,
  QueryEditor: ({ onEdit }: { onEdit: (v: string) => void }) => (
    <textarea data-testid='query-editor-mock' onChange={(e) => onEdit(e.target.value)} />
  ),
  VariableEditor: ({ onEdit }: { onEdit: (v: string) => void }) => (
    <textarea data-testid='variable-editor-mock' onChange={(e) => onEdit(e.target.value)} />
  ),
  GraphiQLProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='graphiql-provider-mock'>{children}</div>
  ),
  usePrettifyEditors: () => {
    return () => JSON.stringify('{"nonPrettyKey":"nonPrettyValue"}', null, 2);
  },
}));

const noOpFetcher: Fetcher = () => {
  return {};
};

const mockOnQueryEdit = vi.fn();
const mockOnQueryVariablesEdit = vi.fn();
const mockOnBlur = vi.fn();

const renderWithGraphiQLProvider = () => {
  return render(
    <GraphiQLProvider fetcher={noOpFetcher}>
      <RDTGraphiQLRequestEditor
        onQueryEdit={mockOnQueryEdit}
        onQueryVariablesEdit={mockOnQueryVariablesEdit}
        onBlur={mockOnBlur}
      />
    </GraphiQLProvider>
  );
};

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

describe('RDTGraphiQLRequestEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the editor', () => {
    renderWithGraphiQLProvider();

    expect(screen.getByTestId('query-editor-mock')).toBeInTheDocument();
    expect(screen.getByTestId('variable-editor-mock')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', async () => {
    renderWithGraphiQLProvider();
    const editor = screen.getAllByRole('textbox')[0];
    fireEvent.change(editor, { target: { value: 'query { test }' } });
    await waitFor(() => expect(mockOnQueryEdit).toHaveBeenCalledWith('query { test }'));
  });

  it('calls prettify when prettify button is clicked', async () => {
    renderWithGraphiQLProvider();

    const prettifyButton = screen.getByRole('button', { name: 'prettifyButton' });
    fireEvent.click(prettifyButton);
  });

  it('calls onBlur when editor loses focus', async () => {
    renderWithGraphiQLProvider();
    const editor = screen.getAllByRole('textbox')[0];
    fireEvent.blur(editor);
    await waitFor(() => expect(mockOnBlur).toHaveBeenCalled());
  });
});
