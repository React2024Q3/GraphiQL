'use client';

import { useEffect, useRef } from 'react';

import LanguageSelect from '@/components/LanguageSelect';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logout } from '@/firebase/utils';
import { Link } from '@/navigation';
import throttle from '@/utils/throttle';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

import { LeftMenu } from '../LeftMenu';
import Logo from '../Logo';
import { AuthenticatedNav } from './AuthenticatedNav';
import { GuestNav } from './GuestNav';
import styles from './Header.module.css';

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const removeClassTimeout = useRef<NodeJS.Timeout | null>(null);
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const t = useTranslations();

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
        {!loading && !isMobile && (
          <Button>
            <Typography className={styles.header__logo_title} component='h1' variant='subtitle1'>
              {t('app-title')}
            </Typography>
          </Button>
        )}
      </Link>

      <nav className={styles.nav}>
        {!loading &&
          (isMobile ? <LeftMenu /> : user ? <AuthenticatedNav logout={logout} /> : <GuestNav />)}

        <LanguageSelect />
      </nav>
    </header>
  );
}
