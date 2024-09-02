import { FC } from 'react';

import { Notification } from '@/components/Notification';

import { ErrorNotificationProps } from './types';

export const ErrorNotification: FC<ErrorNotificationProps> = ({ error }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return <Notification isOpen={!!error} message={message} severity='error' />;
};
