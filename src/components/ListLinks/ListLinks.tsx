import { Link } from '@/navigation';

import styles from './listLinks.module.css';

export default function ListLinks({ isUser }: { isUser: boolean }) {
  return (
    <ul className={styles.list}>
      {isUser ? (
        <>
          <li className={styles.item}>
            <Link className={styles.link} href='/rest'>
              REST Client
            </Link>
          </li>
          <li className={styles.item}>
            <Link className={styles.link} href='/graphiql'>
              GraphiQL Client
            </Link>
          </li>
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
