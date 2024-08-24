export type NotificationProps = {
  isOpen: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};
