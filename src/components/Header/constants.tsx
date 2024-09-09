import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import HubIcon from '@mui/icons-material/Hub';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';

export const AUTH_NAV_LINKS = [
  {
    key: 'main',
    href: '/',
    icon: <HomeIcon color='primary' />,
  },
  {
    key: 'rest',
    href: '/GET',
    icon: <SettingsIcon color='primary' />,
  },
  {
    key: 'graphql',
    href: '/graphiql',
    icon: <HubIcon color='primary' />,
  },
  {
    key: 'history',
    href: '/history',
    icon: <HistoryIcon color='primary' />,
  },
];

export const GUEST_NAV_LINKS = [
  {
    key: 'sign-up',
    href: '/sign-up',
    icon: <AppRegistrationIcon color='primary' />,
  },
  {
    key: 'sign-in',
    href: '/sign-in',
    icon: <LoginIcon color='primary' />,
  },
];
