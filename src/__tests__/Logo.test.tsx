import Logo from '@/components/Logo';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Logo Component', () => {
  it('must render the component without errors', () => {
    const { getByRole } = render(<Logo />);

    const reactSvg = getByRole('img', { hidden: true });
    expect(reactSvg).toBeInTheDocument();
  });

  it('must render the RSS component inside', () => {
    render(<Logo />);

    const sElements = screen.getAllByText('S');

    expect(screen.getByText('R')).toBeInTheDocument();
    expect(sElements).toHaveLength(2);
  });
});
