import NotFoundPage from '@/app/[locale]/404/page';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/not-found', () => ({
  __esModule: true,
  default: () => <div>NotFound Component</div>,
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

describe('NotFoundPage', () => {
  it('should render the NotFound component', () => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <NotFoundPage />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/go-back/)).toBeInTheDocument();
  });
});
