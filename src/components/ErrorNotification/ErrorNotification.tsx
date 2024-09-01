import { FC } from 'react';

import { Notification } from '@/components/Notification';

import { ErrorNotificationProps } from './types';

export const ErrorNotification: FC<ErrorNotificationProps> = ({ error }) =>
  error && <Notification isOpen={!!error} message={error.message} severity='error' />;
