import { FC } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import { Button, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import styles from '../Header.module.css';
import { AuthenticatedNavProps } from '../types';

export const AuthenticatedNav: FC<AuthenticatedNavProps> = ({ logout }) => {
  const t = useTranslations('buttons');

  return (
    <>
      <Link href='/'>
        <Button className={styles.header__button}>{t('main')}</Button>
      </Link>
      <Link href='/rest'>
        <Button className={styles.header__button}>{t('rest')}</Button>
      </Link>
      <Link href='/graphiql'>
        <Button className={styles.header__button}>{t('graphql')}</Button>
      </Link>
      <Link href='/history'>
        <Button className={styles.header__button}>{t('history')}</Button>
      </Link>
      <IconButton className={styles.header__icon_button} onClick={logout} color='secondary'>
        <LogoutIcon />
      </IconButton>
    </>
  );
};
