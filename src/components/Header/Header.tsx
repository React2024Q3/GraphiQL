import Link from 'next/link';
import Logo from '../Logo';
import { useEffect } from 'react';

export default function Header() {
  const handleScroll = () => {
    // if (window.scrollY > 0) {
    // } else {
    // }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header">
      <Logo />
      <nav className="nav">
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
