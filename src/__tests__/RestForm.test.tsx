import RestForm from '@/components/RestForm/RestForm';
import { Methods } from '@/types&interfaces/enums';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ replace: vi.fn() }),
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
  json: () => Promise.resolve({ success: true }),
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

// global.fetch = vi.fn(() =>
//   Promise.resolve({
//     ok: true,
//     status: 200,
//     statusText: 'OK',
//     json: () => Promise.resolve({ success: true }),
//     text: () => Promise.resolve('Text response'),
//     redirected: false,
//     url: 'https://example.com',
//     headers: {
//       get: vi.fn().mockReturnValue('application/json'),
//       entries: () => new Map([['content-type', 'application/json']]).entries(),
//     },
//     clone: vi.fn(),
//     body: null,
//     bodyUsed: false,
//   })
// );

describe('RestForm Component', () => {
  const mockInitMethod = Methods.GET;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render RestForm with default GET method and empty URL', () => {
    render(<RestForm initMethod={mockInitMethod} path={[]} />);

    expect(screen.getByLabelText(/URL/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should change the method and URL', () => {
    render(<RestForm initMethod={mockInitMethod} path={[]} />);

    const methodSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(methodSelect);
    fireEvent.click(screen.getByRole('option', { name: 'POST' }));

    expect(screen.getByRole('combobox')).toHaveTextContent('POST');

    const urlInput = screen.getByLabelText(/URL/);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    expect(urlInput).toHaveValue('https://example.com');
  });

  it('should submit the form and display response', async () => {
    render(<RestForm initMethod={mockInitMethod} path={[]} />);

    const urlInput = screen.getByLabelText(/URL/);
    expect(urlInput).toBeInTheDocument();

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    expect(urlInput).toHaveValue('https://example.com');

    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/200/)).toBeInTheDocument();
      expect(screen.getByText(/OK/)).toBeInTheDocument();
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('should toggle JSON and Text mode for POST method', () => {
    render(<RestForm initMethod={Methods.POST} path={[]} />);

    const toggleButton = screen.getByRole('button', { name: /to-text/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/buttons.to-json/);

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/buttons.to-text/);
  });

  it('should handle URL and body decoding errors', () => {
    const mockPathWithError = ['invalid-url', 'invalid-body'];

    render(<RestForm initMethod={mockInitMethod} path={mockPathWithError} />);

    expect(screen.getByText(/errors.decode/i)).toBeInTheDocument();
  });

  it('should display errors when request fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<RestForm initMethod={mockInitMethod} path={[]} />);

    const urlInput = screen.getByLabelText(/URL/);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/errors.request-error/);
      expect(errorMessages[0]).toBeInTheDocument();
    });
  });

  it('should update key-value pairs in headers and variables', () => {
    render(<RestForm initMethod={mockInitMethod} path={[]} />);

    const [headerKeyInput] = screen.getAllByLabelText(/client\.key/i);
    const [headerValueInput] = screen.getAllByLabelText(/client\.value/i);

    fireEvent.change(headerKeyInput, { target: { value: 'Authorization' } });
    expect(headerKeyInput).toHaveValue('Authorization');

    fireEvent.change(headerValueInput, { target: { value: 'Bearer new-token' } });
    expect(headerValueInput).toHaveValue('Bearer new-token');

    const [variableKeyInput] = screen.getAllByLabelText(/client\.key/i, {
      selector: 'input:not([disabled])',
    });
    const [variableValueInput] = screen.getAllByLabelText(/client\.value/i, {
      selector: 'input:not([disabled])',
    });

    fireEvent.change(variableKeyInput, { target: { value: 'env' } });
    expect(variableKeyInput).toHaveValue('env');

    fireEvent.change(variableValueInput, { target: { value: 'staging' } });
    expect(variableValueInput).toHaveValue('staging');
  });
});
