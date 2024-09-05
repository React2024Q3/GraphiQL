import { FC } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from '../MainContent.module.css';

export const ProjectSection: FC = () => {
  const t = useTranslations('Home.project');

  return (
    <Box className={styles.project}>
      <Container className={styles.container}>
        <Typography variant='h5' className={styles.title}>
          {t('title')}
        </Typography>
        {t('content')
          .split('\n')
          .map((line, index) => (
            <Typography className={styles.text} variant='body1' key={index}>
              {line.trim()}
              <br />
              <br />
            </Typography>
          ))}
        <Box className={styles.developers}></Box>
      </Container>
    </Box>
  );
};
