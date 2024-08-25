'use client';
import Link from 'next/link';
import Logo from '../Logo';
import { useEffect, useRef } from 'react';

import styles from './Header.module.css';
import throttle from '@/utils/throttle';
import { Button } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { logout } from '@/firebase/utils';

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const removeClassTimeout = useRef<NodeJS.Timeout | null>(null);

  const [user] = useAuthState(auth);

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
      <Link href="./">
        <Logo />
      </Link>

      <nav className={styles.nav}>
        <Link href="./" className={styles.nav__link}>
          Welcome Page
        </Link>
        <div className={styles.lang}>
          <select id="lange-selector">
            <option value="en">Eng</option>
            <option value="ru">Рус</option>
          </select>
        </div>
        <Link href={user ? '#' : '/sign-in'}>
          <Button className={styles.logoutBtn} onClick={user ? logout : undefined}>
            {user ? 'Logout' : 'Sign in'}
          </Button>
        </Link>
      </nav>
    </header>
  );
}
