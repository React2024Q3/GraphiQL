import { Link } from '@/navigation';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

import { CommonLinks } from './CommonLinks';
import styles from './ListLinks.module.css';

export default function ListLinks({ isUser }: { isUser: boolean }) {
  const t = useTranslations('buttons');

  return (
    <ul className={styles.list}>
      {isUser ? (
        <>
          <CommonLinks />
          <li>
            <Link href='/history'>
              <Button variant='contained' color='secondary' sx={{ color: '#000' }}>
                {t('history')}
              </Button>
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href='sign-in'>
              <Button variant='contained'>{t('sign-in')}</Button>
            </Link>
          </li>
          <li>
            <Link href='/sign-up'>
              <Button variant='contained'>{t('sign-up')}</Button>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
