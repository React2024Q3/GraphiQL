'use client';

import { useEffect, useRef } from 'react';

import LanguageSelect from '@/components/LanguageSelect';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logout } from '@/firebase/utils';
import { Link } from '@/navigation';
import throttle from '@/utils/throttle';
import { Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { LoadingSkeleton } from '../LoadingSkeleton';
import Logo from '../Logo';
import styles from './Header.module.css';

export default function Header({ locale }: { locale: string }) {
  const headerRef = useRef<HTMLElement | null>(null);
  const removeClassTimeout = useRef<NodeJS.Timeout | null>(null);
  const { user, loading } = useAuth();
  const t = useTranslations('buttons');

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (headerRef.current) {
        const tempRef = headerRef.current as HTMLElement;

        if (window.scrollY > 0) {
          if (!tempRef.classList.contains(styles.isScroll)) {
            tempRef.classList.add(styles.isScroll);
          }

          if (removeClassTimeout.current) {
            clearTimeout(removeClassTimeout.current);
            removeClassTimeout.current = null;
          }
        } else {
          removeClassTimeout.current = setTimeout(() => {
            if (tempRef.classList.contains(styles.isScroll)) {
              tempRef.classList.remove(styles.isScroll);
            }
          }, 100);
        }
      }
    }, 10);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (removeClassTimeout.current) {
        clearTimeout(removeClassTimeout.current);
      }
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <Link className={styles.header__logo} href='./'>
        <Logo />
        <Typography className={styles.header__logo_title} variant='h6' color='primary.light'>
          REST/GraphiQL Client
        </Typography>
      </Link>

      <nav className={styles.nav}>
        {loading ? (
          <LoadingSkeleton className={styles.button__skeleton} variant='rounded' />
        ) : (
          <Link href={!user ? '/sign-up' : '/'}>
            <Button variant='contained'>{!user ? t('sign-up') : t('main')}</Button>
          </Link>
        )}

        {loading ? (
          <LoadingSkeleton className={styles.button__skeleton} variant='rounded' />
        ) : (
          <Link href={user ? '#' : '/sign-in'}>
            <Button variant='contained' onClick={user ? logout : undefined}>
              {user ? t('sign-out') : t('sign-in')}
            </Button>
          </Link>
        )}

        <LanguageSelect locale={locale} />
      </nav>
    </header>
  );
}
