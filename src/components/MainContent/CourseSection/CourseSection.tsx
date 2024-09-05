import { FC } from 'react';

import { Box, Container, Typography } from '@mui/material';

import styles from '../MainContent.module.css';
import { COURSE_INFO, COURSE_TITLE } from '../constants';

export const CourseSection: FC = () => {
  return (
    <Box className={styles.course}>
      <Container className={styles.container}>
        <Typography variant='h5' className={styles.title}>
          {COURSE_TITLE}
        </Typography>
        {COURSE_INFO.split('\n').map((line, index) => (
          <Typography className={styles.text} variant='body1' key={index}>
            {line.trim()}
            <br />
          </Typography>
        ))}
        <Box className={styles.developers}></Box>
      </Container>
    </Box>
  );
};
