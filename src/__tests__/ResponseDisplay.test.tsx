import ResponseDisplay from '@/components/ResponseDisplay';
import { ApiResponse } from '@/types&interfaces/interfaces';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';

vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => <div data-testid='codemirror-mock'>{value}</div>,
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;

  return {
    ...actual,
    useTranslations: () => (key: string) => {
      const translations: Record<string, string> = {
        'client.res-statusCode': 'res-statusCode',
        'client.res-statusText': 'res-statusText',
        'client.res-body': 'res-body',
        'client.no-res-body': 'no-res-body',
        'client.res-header': 'res-header',
        'client.no-res-header': 'no-res-header',
      };
      return translations[key] || key;
    },
  };
});

describe('ResponseDisplay Component', () => {
  const mockResponse: ApiResponse = { data: { message: 'Success' } };
  const mockHeaders = 'application/json';
  const mockStatusText = 'OK';

  it('should render status code and status text correctly with color for status code 200', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <ResponseDisplay
          response={mockResponse}
          headers={mockHeaders}
          statusText={mockStatusText}
          statusCode='200'
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/res-statusCode/)).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.getByText(/res-statusText/)).toBeInTheDocument();
    expect(screen.getByText(/OK/)).toBeInTheDocument();

    const statusCodeSpan = screen.getByText(/200/).parentElement?.querySelector('span');
    expect(statusCodeSpan).toHaveStyle('color: rgb(0, 255, 0)');

    const statusTextSpan = screen.getByText(/OK/).parentElement?.querySelector('span');
    expect(statusTextSpan).toHaveStyle('color: rgb(0, 255, 0)');
  });

  it('should render status code and status text correctly with color for status code 404', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <ResponseDisplay
          response={mockResponse}
          headers={mockHeaders}
          statusText={mockStatusText}
          statusCode='404'
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/res-statusCode/)).toBeInTheDocument();
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/res-statusText/)).toBeInTheDocument();
    expect(screen.getByText(/OK/)).toBeInTheDocument();

    const statusCodeSpan = screen.getByText(/404/).parentElement?.querySelector('span');
    expect(statusCodeSpan).toHaveStyle('color: rgb(255, 0, 0)');

    const statusTextSpan = screen.getByText(/OK/).parentElement?.querySelector('span');
    expect(statusTextSpan).toHaveStyle('color: rgb(255, 0, 0)');
  });

  it('should display JSON response body if content type is application/json', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <ResponseDisplay
          response={mockResponse}
          headers={mockHeaders}
          statusText={mockStatusText}
          statusCode='200'
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/res-body/)).toBeInTheDocument();
    expect(screen.getByText(/Success/)).toBeInTheDocument();
  });

  it('should display "No response body" if response is null', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <ResponseDisplay
          response={null}
          headers={mockHeaders}
          statusText={mockStatusText}
          statusCode='200'
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('no-res-body')).toBeInTheDocument();
  });

  it('should display "No response header" if headers are missing', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <ResponseDisplay
          response={mockResponse}
          headers={''}
          statusText={mockStatusText}
          statusCode='200'
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('no-res-header')).toBeInTheDocument();
  });
});
