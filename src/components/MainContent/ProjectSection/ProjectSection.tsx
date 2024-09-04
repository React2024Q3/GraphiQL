import { FC } from 'react';

import { Box, Container, Typography } from '@mui/material';

import styles from '../MainContent.module.css';
import { PROJECT_INFO, PROJECT_TITLE } from '../constants';

export const ProjectSection: FC = () => {
  return (
    <Box className={styles.project}>
      <Container className={styles.container}>
        <Typography variant='h5' className={styles.title}>
          {PROJECT_TITLE}
        </Typography>
        {PROJECT_INFO.split('\n').map((line, index) => (
          <Typography variant='body1' key={index}>
            {line.trim()}
            <br />
          </Typography>
        ))}
        <Box className={styles.developers}></Box>
      </Container>
    </Box>
  );
};
