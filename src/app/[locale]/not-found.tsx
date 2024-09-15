import { Link } from '@/navigation';
import styles from '@/shared/styles/sharedStyles.module.css';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('not-found-page');

  return (
    <Box className={styles.error__container}>
      <Typography variant='h4'>{t('title')}</Typography>
      <Typography variant='subtitle1'>{t('description')}</Typography>
      <Link href='/'>{t('go-back')}</Link>
    </Box>
  );
}
