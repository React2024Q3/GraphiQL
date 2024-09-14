import { ApiResponse } from '@/types&interfaces/interfaces';

import { ErrorNotification } from '../ErrorNotification';

interface ErrorsNotificationsRestClientProps {
  parseError: string | null;
  error: Error | undefined;
  response: ApiResponse | null;
}

export default function ErrorsNotificationsRestClient({
  parseError,
  error,
  response,
}: ErrorsNotificationsRestClientProps) {
  return (
    <>
      <ErrorNotification error={parseError} />
      <ErrorNotification error={error} />
      <ErrorNotification error={response?.error} />
    </>
  );
}
