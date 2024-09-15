import GraphiQLPage from '@/app/[locale]/graphiql/[[...path]]/page';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/GraphiQLForm', () => ({
  default: ({ path }: { path: string[] }) => <div>Mocked GraphiQLForm Path: {path.join(', ')}</div>,
}));

describe('GraphiQLPage', () => {
  it('should render the GraphiQL page with title and form', () => {
    (useTranslations as jest.Mock).mockReturnValue(() => 'GraphQL Button');

    const mockPath = ['api', 'v1'];

    render(<GraphiQLPage params={{ path: mockPath }} />);

    expect(screen.getByText('GraphQL Button')).toBeInTheDocument();

    expect(screen.getByText('Mocked GraphiQLForm Path: api, v1')).toBeInTheDocument();
  });
});
