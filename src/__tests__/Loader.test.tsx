import { Loader } from '@/components/Loader';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Loader Component', () => {
  it('should render LinearProgress with correct styles', () => {
    render(<Loader />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    expect(progressBar).toHaveStyle({
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      zIndex: '9999',
    });
  });
});
