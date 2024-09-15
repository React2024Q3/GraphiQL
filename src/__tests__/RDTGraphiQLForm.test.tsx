import RDTGraphiQLForm from '@/components/GraphiQLForm/RDTGraphiQLForm';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useSearchParams: () => ({
      entries: () => new Map([['param', 'value']]).entries(),
    }),
  };
});

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/shared/hooks/useAuthRedirect', () => ({
  useAuthRedirect: () => ({
    loading: false,
    error: null,
  }),
}));

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
    loading: false,
    error: null,
  }),
}));

vi.mock('@/components/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    onBlur,
  }: {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
  }) => (
    <textarea
      data-testid='codemirror-mock'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  ),
}));

const mockResponse: Response = {
  ok: true,
  status: 200,
  statusText: 'OK',
  json: () => Promise.resolve({ data: { example: 'result' } }),
  text: () => Promise.resolve('Text response'),
  redirected: false,
  url: 'https://example.com',
  headers: new Headers({
    'content-type': 'application/json',
  }),
  clone: vi.fn(),
  body: null,
  bodyUsed: false,
  type: 'default',
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  blob: () => Promise.resolve(new Blob()),
  formData: () => Promise.resolve(new FormData()),
} as unknown as Response;

global.fetch = vi.fn(() => Promise.resolve(mockResponse));

describe('RDTGraphiQLForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with the default values', () => {
    render(<RDTGraphiQLForm path={[]} />);

    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/queryExample/i)).toBeInTheDocument();
    expect(screen.getByText(/run/i)).toBeInTheDocument();
  });

  it('displays validation error when an invalid URL is input', () => {
    render(<RDTGraphiQLForm path={[]} />);

    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.blur(urlInput);

    expect(screen.getByText(/urlNotValid/i)).toBeInTheDocument();
  });

  it('allows form submission with a valid URL and fetches data', async () => {
    render(<RDTGraphiQLForm path={[]} />);

    const urlInput = screen.getByLabelText(/url/i);
    const runButton = screen.getByText(/run/i);

    fireEvent.change(urlInput, { target: { value: 'https://example.com/graphql' } });
    fireEvent.blur(urlInput);

    fireEvent.click(runButton);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toBe('https://example.com/graphql');
      expect(calls[0][1]).toEqual(expect.objectContaining({ method: 'POST' }));
    });
  });

  it('displays error messages when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<RDTGraphiQLForm path={[]} />);

    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/graphql' } });

    const runButton = screen.getByText(/run/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Please check your network and CORS settings/);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
