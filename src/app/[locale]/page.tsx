import { UserName } from '@/components/UserName';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <UserName />
    </div>
  );
}
