import { FC } from 'react';

import { Box, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import styles from '../Header.module.css';
import { GUEST_NAV_LINKS } from '../constants';

export const GuestNav: FC = () => {
  const t = useTranslations('buttons');

  return (
    <Box className={styles.nav__buttons}>
      {GUEST_NAV_LINKS.map((link) => (
        <Link key={link.key} href={link.href}>
          <Button className={styles.header__button}>{t(link.key)}</Button>
        </Link>
      ))}
    </Box>
  );
};
