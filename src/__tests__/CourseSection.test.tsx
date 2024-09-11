import { CourseSection } from '@/components/MainContent/CourseSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('CourseSection Component', () => {
  const mockUseTranslations = useTranslations as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: { [key: string]: string } = {
        title: 'Course Overview',
        content: 'This is the first line.\nThis is the second line.',
      };
      return translations[key];
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the course title and content', () => {
    render(<CourseSection />);

    expect(screen.getByText('Course Overview')).toBeInTheDocument();
    expect(screen.getByText('This is the first line.')).toBeInTheDocument();
    expect(screen.getByText('This is the second line.')).toBeInTheDocument();
  });
});
