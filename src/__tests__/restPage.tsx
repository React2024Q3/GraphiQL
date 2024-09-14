import RestPage from '@/app/[locale]/[method]/[[...path]]/page';
import { redirect } from '@/navigation';
import { MethodType } from '@/types&interfaces/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/navigation', () => ({
  redirect: vi.fn(),
}));

describe('RestPage', () => {
  it('renders RestForm with correct props and title', () => {
    const params = {
      method: 'GET' as MethodType,
      path: ['encodedPath'],
    };

    render(<RestPage params={params} />);

    expect(screen.getByText('buttons.rest')).toBeInTheDocument();

    expect(screen.getByText('RestForm')).toBeInTheDocument();
  });

  it('redirects if an invalid method is provided', () => {
    const params = {
      method: 'INVALID_METHOD' as MethodType,
      path: ['encodedPath'],
    };

    render(<RestPage params={params} />);

    expect(redirect).toHaveBeenCalledWith('/404');
  });
});
