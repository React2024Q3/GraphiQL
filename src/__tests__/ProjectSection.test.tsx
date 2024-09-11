import { ProjectSection } from '@/components/MainContent/ProjectSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('ProjectSection Component', () => {
  const mockUseTranslations = useTranslations as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: { [key: string]: string } = {
        title: 'Project Title',
        content: 'This is line one.\nThis is line two.\nThis is line three.',
      };
      return translations[key] || key;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the project section with title and content', () => {
    render(<ProjectSection />);

    expect(screen.getByText('Project Title')).toBeInTheDocument();

    expect(screen.getByText('This is line one.')).toBeInTheDocument();
    expect(screen.getByText('This is line two.')).toBeInTheDocument();
    expect(screen.getByText('This is line three.')).toBeInTheDocument();
  });

  test('renders each line of content with proper spacing', () => {
    render(<ProjectSection />);

    const paragraphs = screen.getAllByRole('paragraph');
    expect(paragraphs.length).toBe(3);

    expect(screen.getByText('This is line one.')).toContainHTML('<br /><br />');
  });
});
