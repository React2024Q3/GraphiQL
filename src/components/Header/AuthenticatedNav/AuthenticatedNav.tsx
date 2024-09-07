import { FC } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import styles from '../Header.module.css';
import { AUTH_NAV_LINKS } from '../constants';
import { AuthenticatedNavProps } from '../types';

export const AuthenticatedNav: FC<AuthenticatedNavProps> = ({ logout }) => {
  const t = useTranslations('buttons');

  return (
    <Box className={styles.nav__links}>
      {AUTH_NAV_LINKS.map((link) => (
        <Link key={link.key} href={link.href}>
          <Button className={styles.header__button}>{t(link.key)}</Button>
        </Link>
      ))}
      <IconButton className={styles.header__icon_button} onClick={logout} color='secondary'>
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};
