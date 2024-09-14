import CodeEditor from '@/components/RestForm/CodeEditor';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

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

describe('CodeEditor Component', () => {
  const mockOnChange = vi.fn();

  const renderComponent = (value = '', isJsonMode = true) => {
    return render(<CodeEditor value={value} onChange={mockOnChange} isJsonMode={isJsonMode} />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the CodeEditor with the initial value', () => {
    renderComponent('{"key":"value"}');

    const textarea = screen.getByTestId('codemirror-mock');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('{"key":"value"}');
  });

  it('should call onChange when the value changes', () => {
    renderComponent('{"key":"value"}');

    const textarea = screen.getByTestId('codemirror-mock');
    fireEvent.change(textarea, { target: { value: '{"key":"new value"}' } });

    expect(mockOnChange).toHaveBeenCalledWith('{"key":"new value"}');
  });

  it('should format the JSON when isJsonMode is true and onBlur is triggered', () => {
    const rawJson = '{"key":"value"}';
    const formattedJson = `{
  "key": "value"
}`;

    renderComponent(rawJson, true);

    const textarea = screen.getByTestId('codemirror-mock');
    fireEvent.blur(textarea);

    expect(mockOnChange).toHaveBeenCalledWith(formattedJson);
  });

  it('should log a warning for invalid JSON and not call onChange onBlur', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderComponent('{"key": invalidJson}', true);

    const textarea = screen.getByTestId('codemirror-mock');
    fireEvent.blur(textarea);

    expect(consoleWarnSpy).toHaveBeenCalledWith('JSON formatting error: ', expect.any(SyntaxError));
    expect(mockOnChange).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('should not format the value when isJsonMode is false', () => {
    renderComponent('some non-json text', false);

    const textarea = screen.getByTestId('codemirror-mock');
    fireEvent.blur(textarea);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
