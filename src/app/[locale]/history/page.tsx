'use client';

import { ErrorNotification } from '@/components/ErrorNotification';
import { CommonLinks } from '@/components/ListLinks/CommonLinks';
import linksStyles from '@/components/ListLinks/ListLinks.module.css';
import { Loader } from '@/components/Loader';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { Container, Typography } from '@mui/material';
import Link from 'next/link';

import styles from './history.module.css';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import urlToRequestTransform from '@/utils/urlToRequestTransform';

export default function History() {
  const { loading, error } = useAuthRedirect();
  // const [history, setHistory] = useState<RequestType[]>([]);
  const [listUrl] = useHistoryLS();
  console.log(listUrl);
  
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
          <Typography variant='subtitle1'>You haven't executed any requests</Typography>
          <Typography variant='subtitle1'>It's empty here. Try:</Typography>
          <ul className={linksStyles.list}>
            <CommonLinks />
          </ul>
        </>
      ) : (
        listUrl.map((encodeUrl: string, index: number) => {
          const request = urlToRequestTransform(encodeUrl);
          if(!request) return null;
          const {url, method} = request;
         return (
          <Link href={encodeUrl} key={index}>
            {`${method} ${url}`}
          </Link>
        )})
      )}
      <ErrorNotification error={error} />
    </Container>
  );
}
