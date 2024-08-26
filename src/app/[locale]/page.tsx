import { UserName } from '@/components/UserName';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <UserName />
    </main>
  );
}
