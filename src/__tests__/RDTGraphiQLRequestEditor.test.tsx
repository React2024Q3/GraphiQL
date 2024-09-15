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

const renderWithGraphiQLProvider = (ui: React.ReactElement) => {
  return render(<GraphiQLProvider fetcher={noOpFetcher}>{ui}</GraphiQLProvider>);
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
  const mockOnQueryEdit = vi.fn();
  const mockOnQueryVariablesEdit = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the editor', () => {
    renderWithGraphiQLProvider(
      <RDTGraphiQLRequestEditor
        onQueryEdit={mockOnQueryEdit}
        onQueryVariablesEdit={mockOnQueryVariablesEdit}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByTestId('query-editor-mock')).toBeInTheDocument();
    expect(screen.getByTestId('variable-editor-mock')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', async () => {
    renderWithGraphiQLProvider(
      <RDTGraphiQLRequestEditor
        onQueryEdit={mockOnQueryEdit}
        onQueryVariablesEdit={mockOnQueryVariablesEdit}
        onBlur={mockOnBlur}
      />
    );
    const editor = screen.getAllByRole('textbox')[0];
    fireEvent.change(editor, { target: { value: 'query { test }' } });
    await waitFor(() => expect(mockOnQueryEdit).toHaveBeenCalledWith('query { test }'));
  });

  it('calls prettify when prettify button is clicked', async () => {
    renderWithGraphiQLProvider(
      <RDTGraphiQLRequestEditor
        onQueryEdit={mockOnQueryEdit}
        onQueryVariablesEdit={mockOnQueryVariablesEdit}
        onBlur={mockOnBlur}
      />
    );

    const prettifyButton = screen.getByRole('button', { name: 'prettifyButton' });
    fireEvent.click(prettifyButton);
  });

  it('calls onBlur when editor loses focus', async () => {
    renderWithGraphiQLProvider(
      <RDTGraphiQLRequestEditor
        onQueryEdit={mockOnQueryEdit}
        onQueryVariablesEdit={mockOnQueryVariablesEdit}
        onBlur={mockOnBlur}
      />
    );
    const editor = screen.getAllByRole('textbox')[0];
    fireEvent.blur(editor);
    await waitFor(() => expect(mockOnBlur).toHaveBeenCalled());
  });
});
