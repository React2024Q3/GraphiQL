import { useHandleError } from '@/shared/hooks/useHandleError';
import { ApiResponse } from '@/types&interfaces/interfaces';

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
  useHandleError(parseError);
  useHandleError(error);
  useHandleError(response?.error);
  return <></>;
}
