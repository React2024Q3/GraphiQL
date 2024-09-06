'use client';

import { ErrorNotification } from '@/components/ErrorNotification';
import { CommonLinks } from '@/components/ListLinks/CommonLinks';
import linksStyles from '@/components/ListLinks/ListLinks.module.css';
import { Loader } from '@/components/Loader';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import urlToRequestTransform from '@/utils/urlToRequestTransform';
import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import styles from './history.module.css';

export default function History() {
  const { loading, error } = useAuthRedirect();
  // const [history, setHistory] = useState<RequestType[]>([]);
  const [listUrl] = useHistoryLS();
  const t = useTranslations('history');
  // history.sort((a, b) => b.timestamp - a.timestamp);

  // useEffect(() => {
  //   const storedHistory = JSON.parse(localStorage.getItem('request_history') || '[]');
  //   setHistory(storedHistory);
  // }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className={styles.history__container}>
      <Typography className={styles.history__title} variant='h4' component='h4'>
        History Requests
      </Typography>
      {!listUrl.length ? (
        <>
          <Typography variant='subtitle1'>{t('empty-1')}</Typography>
          <Typography variant='subtitle1'>{t('empty-2')}</Typography>
          <ul className={linksStyles.list}>
            <CommonLinks />
          </ul>
        </>
      ) : (
        listUrl.map((encodeUrl: string, index: number) => {
          const request = urlToRequestTransform(encodeUrl);
          if (!request) return null;
          const { url, method } = request;
          const route = method === 'GRAPHQL' ? 'graphiql' : 'rest';
          return (
            <Link href={route + '/' + encodeUrl} key={index}>
              {`${method} ${url}`}
            </Link>
          );
        })
      )}
      <ErrorNotification error={error} />
    </Container>
  );
}
