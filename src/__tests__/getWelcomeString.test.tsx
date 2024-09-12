import { getWelcomeString } from '@/components/MainContent/WelcomeSection/helpers';
import { render, screen } from '@testing-library/react';
import { User } from 'firebase/auth';
import { describe, expect, it } from 'vitest';

describe('getWelcomeString', () => {
  it('renders correctly when user is not provided', () => {
    const greeting = 'Welcome';
    const name = '';
    const user = null;

    render(getWelcomeString(user, name, greeting));

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });

  it('renders correctly when user and name are provided', () => {
    const greeting = 'Welcome';
    const name = 'John';
    const user = {} as User;

    render(getWelcomeString(user, name, greeting));

    expect(screen.getByText(/Welcome,/)).toBeInTheDocument();
    expect(screen.getByText(/John!/)).toBeInTheDocument();
  });

  it('renders correctly with spacing when user is provided but no name', () => {
    const greeting = 'Welcome';
    const name = '';
    const user = {} as User;

    render(getWelcomeString(user, name, greeting));

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });

  it('renders Typography component correctly', () => {
    const greeting = 'Hello';
    const name = 'Jane';
    const user = {} as User;

    const { container } = render(getWelcomeString(user, name, greeting));

    const typography = container.querySelector('span');
    expect(typography).toHaveTextContent('Jane!');
    expect(typography).toHaveStyle('font-weight: 700');
  });
});
