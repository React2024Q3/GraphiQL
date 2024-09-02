import { Link } from '@/navigation';

import { CommonLinks } from './CommonLinks';
import styles from './ListLinks.module.css';

export default function ListLinks({ isUser }: { isUser: boolean }) {
  return (
    <ul className={styles.list}>
      {isUser ? (
        <>
          <CommonLinks />
          <li className={styles.item}>
            <Link className={styles.link} href='/history'>
              History
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className={styles.item}>
            <Link className={styles.link} href='sign-in'>
              Sign In
            </Link>
          </li>
          <li className={styles.item}>
            <Link className={styles.link} href='/sign-up'>
              Sign Up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
