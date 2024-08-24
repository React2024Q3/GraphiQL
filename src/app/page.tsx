'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './page.module.css';
import { auth } from '@/firebase/config';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <main className={styles.main}>
      <h2>Welcome{user && ` Back, ${user?.displayName}`}!</h2>
    </main>
  );
}
