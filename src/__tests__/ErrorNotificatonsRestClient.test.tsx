import ErrorsNotificationsRestClient from '@/components/ErrorsNotificationsRestClient';
import { ApiResponse } from '@/types&interfaces/interfaces';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../ErrorNotification', () => ({
  __esModule: true,
  ErrorNotification: ({ error }: { error: string | Error | undefined }) => (
    <div data-testid='error-notification'>{error ? String(error) : 'No error'}</div>
  ),
}));

describe('ErrorsNotificationsRestClient Component', () => {
  it('should render ErrorNotification for each provided error prop', () => {
    const parseError = 'Parse Error Message';
    const error = new Error('General Error Message');
    const response: ApiResponse = { error: 'Response Error Message' };

    render(
      <ErrorsNotificationsRestClient parseError={parseError} error={error} response={response} />
    );

    expect(screen.getByText(parseError)).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
    expect(screen.getByText(response.error as string)).toBeInTheDocument();
  });

  it('should not render ErrorNotification if error props are null or undefined', () => {
    render(<ErrorsNotificationsRestClient parseError={null} error={undefined} response={null} />);

    expect(screen.queryByTestId('error-notification')).toBeNull();
  });

  it('should render ErrorNotification only for non-null and non-undefined error props', () => {
    const parseError = 'Parse Error Message';
    const error = undefined;
    const response: ApiResponse = { error: 'Response Error Message' };

    render(
      <ErrorsNotificationsRestClient parseError={parseError} error={error} response={response} />
    );

    expect(screen.getByText(parseError)).toBeInTheDocument();
    expect(screen.getByText(response.error as string)).toBeInTheDocument();
  });
});
