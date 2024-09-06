'use client';

import { useEffect, useRef } from 'react';

import LanguageSelect from '@/components/LanguageSelect';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logout } from '@/firebase/utils';
import { Link } from '@/navigation';
import throttle from '@/utils/throttle';
import { Button, Typography } from '@mui/material';

import { LoadingSkeleton } from '../LoadingSkeleton';
import Logo from '../Logo';
import { AuthenticatedNav } from './AuthenticatedNav';
import { GuestNav } from './GuestNav';
import styles from './Header.module.css';

export default function Header({ locale }: { locale: string }) {
  const headerRef = useRef<HTMLElement | null>(null);
  const removeClassTimeout = useRef<NodeJS.Timeout | null>(null);
  const { user, loading } = useAuth();

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
        <Button>
          <Typography
            className={styles.header__logo_title}
            component='h1'
            variant='subtitle1'
            color='primary.light'
          >
            REST/GraphiQL Client
          </Typography>
        </Button>
      </Link>

      <nav className={styles.nav}>
        {loading ? (
          <LoadingSkeleton className={styles.header__skeleton} variant='rounded' />
        ) : (
          <>{user ? <AuthenticatedNav logout={logout} /> : <GuestNav />}</>
        )}

        <LanguageSelect locale={locale} />
      </nav>
    </header>
  );
}
