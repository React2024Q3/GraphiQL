import { Link } from '@/navigation';

import styles from '../ListLinks.module.css';

export function CommonLinks() {
  return (
    <>
      <li className={styles.item}>
        <Link className={styles.link} href='/get'>
          RESTful Client
        </Link>
      </li>
      <li className={styles.item}>
        <Link className={styles.link} href='/graphiql'>
          GraphiQL Client
        </Link>
      </li>
    </>
  );
}
