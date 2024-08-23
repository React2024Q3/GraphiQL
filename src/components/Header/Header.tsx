'use client';
import Link from 'next/link';
import Logo from '../Logo';
import { useEffect, useRef } from 'react';

import styles from './Header.module.css';
import throttle from '@/utils/throttle';

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const removeClassTimeout = useRef<NodeJS.Timeout | null>(null);

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
      <Logo />
      <nav className={styles.nav}>
        <Link href="welcome.html" className="nav__link">
          Welcome Page
        </Link>
        <div className="lang-toggle">
          <select id="lange-selector">
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <button id="logout" className="logout-button">
          Logout
        </button>
      </nav>
    </header>
  );
}
