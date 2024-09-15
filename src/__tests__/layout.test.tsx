import RootLayout from '@/app/[locale]/layout';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/components/Header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <footer>Footer</footer>,
}));

vi.mock('next/font/google', () => ({
  Inter: vi.fn().mockReturnValue({ className: 'inter' }),
}));

const mockChildren = <div>Child Content</div>;
const mockLocale = 'en';

const renderWithIntlProvider = (locale: string, children: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <RootLayout params={{ locale }}>{children}</RootLayout>
    </NextIntlClientProvider>
  );
};

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders Header, Footer, and children', () => {
    renderWithIntlProvider(mockLocale, mockChildren);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('calls notFound when unsupported locale is passed', () => {
    renderWithIntlProvider('unsupported-locale', mockChildren);

    expect(notFound).toHaveBeenCalled();
  });

  test('does not call notFound when supported locale is passed', () => {
    renderWithIntlProvider(mockLocale, mockChildren);

    expect(notFound).not.toHaveBeenCalled();
  });

  test('applies the correct font class', () => {
    const { container } = renderWithIntlProvider(mockLocale, mockChildren);

    expect(container.querySelector('body')).toHaveClass('inter');
  });
});
