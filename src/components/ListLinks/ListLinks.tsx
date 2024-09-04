import { Link } from '@/navigation';
import { Button } from '@mui/material';

import { CommonLinks } from './CommonLinks';
import styles from './ListLinks.module.css';

export default function ListLinks({ isUser }: { isUser: boolean }) {
  return (
    <ul className={styles.list}>
      {isUser ? (
        <>
          <CommonLinks />
          <li>
            <Link href='/history'>
              <Button variant='contained'>History</Button>
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href='sign-in'>
              <Button variant='contained'>Sign In</Button>
            </Link>
          </li>
          <li>
            <Link href='/sign-up'>
              <Button variant='contained'>Sign Up</Button>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
