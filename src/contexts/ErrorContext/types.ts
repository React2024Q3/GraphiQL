export type ErrorContextType = {
  showError: (error: AppError) => void;
  hideError: () => void;
  error: AppError;
  open: boolean;
};

export type AppError = Error | string | undefined | null;
