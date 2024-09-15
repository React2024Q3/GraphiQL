export type ToasterProps = {
  error: Error | string | undefined | null;
  severity?: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
  onClose: () => void;
};
