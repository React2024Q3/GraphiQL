import { Developers } from '@/components/MainContent/Developers';
import { DEVELOPERS } from '@/shared/constants/developersInfo';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('Developers Component', () => {
  const mockUseTranslations = useTranslations as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: { [key: string]: string } = {
        title: 'Our Developers',
        'names.oleksii': 'Oleksii',
        'names.diana': 'Diana',
        'names.aliaksandr': 'Aliaksandr',
        'role.team-lead': 'Team Lead',
        'role.frontend-developer': 'Frontend Developer',
      };
      return translations[key] || key;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the developer cards with correct names, roles, and social links', () => {
    render(<Developers />);

    expect(screen.getByText('Our Developers')).toBeInTheDocument();

    DEVELOPERS.forEach((_developer, index) => {
      const developerName = index === 0 ? 'Oleksii' : index === 1 ? 'Diana' : 'Aliaksandr';
      const developerCard = screen.getAllByTestId('card')[index];
      const cardWithin = within(developerCard);
      expect(cardWithin.getByText(developerName)).toBeInTheDocument();

      const roleText = index === 0 ? 'Team Lead, Frontend Developer' : 'Frontend Developer';
      expect(cardWithin.getByText(roleText)).toBeInTheDocument();

      expect(cardWithin.getByAltText('github-logo')).toBeInTheDocument();
      expect(cardWithin.getByAltText('linkedIn-logo')).toBeInTheDocument();
    });
  });

  test('renders developer images correctly', () => {
    render(<Developers />);

    DEVELOPERS.forEach((developer, index) => {
      const developerCard = screen.getAllByTestId('card')[index];
      const cardWithin = within(developerCard);
      const img = cardWithin.getByAltText('photo');
      expect(img).toHaveAttribute('src', developer.image);
    });
  });

  test('contains correct links to GitHub and LinkedIn for each developer', () => {
    render(<Developers />);

    DEVELOPERS.forEach((developer, index) => {
      const developerCard = screen.getAllByTestId('card')[index];
      const cardWithin = within(developerCard);
      const githubLink = cardWithin.getByRole('link', { name: /github-logo/i });
      const linkedInLink = cardWithin.getByRole('link', { name: /linkedIn-logo/i });

      expect(githubLink).toHaveAttribute('href', developer.github);
      expect(linkedInLink).toHaveAttribute('href', developer.linkedIn);
    });
  });
});
