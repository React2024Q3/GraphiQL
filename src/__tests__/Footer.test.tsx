import { Footer } from '@/components/Footer';
import { DEVELOPERS } from '@/shared/constants/developersInfo';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/shared/constants/developersInfo', () => ({
  DEVELOPERS: [
    { github: 'https://github.com/dev1', githubName: 'Developer1' },
    { github: 'https://github.com/dev2', githubName: 'Developer2' },
  ],
}));

const renderFooterWithProvider = () => {
  return render(
    <NextIntlClientProvider locale={'en'}>
      <Footer />
    </NextIntlClientProvider>
  );
};

describe('Footer', () => {
  it('renders the current year', () => {
    renderFooterWithProvider();
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('renders links to developers GitHub profiles', () => {
    renderFooterWithProvider();

    DEVELOPERS.forEach(({ githubName }) => {
      expect(screen.getByText(githubName)).toBeInTheDocument();
    });
  });

  it('renders a link to the RS School course', () => {
    renderFooterWithProvider();

    const rssLink = screen.getByRole('link', { name: /rss-logo/i });
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('renders the RS School logo', () => {
    renderFooterWithProvider();

    const logo = screen.getByAltText('rss-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/rss-logo.svg');
    expect(logo).toHaveAttribute('width', '40');
    expect(logo).toHaveAttribute('height', '40');
  });
});
