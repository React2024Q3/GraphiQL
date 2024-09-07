import { FC } from 'react';

import { Link } from '@/navigation';
import { DEVELOPERS } from '@/shared/constants/developersInfo';
import iconStyles from '@/shared/styles/sharedStyles.module.css';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import styles from './Footer.module.css';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <Typography className={styles.year} variant='body2'>
        &copy; 2024
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          gap: {
            xs: '0.5rem',
            sm: '1.5rem',
          },
          alignItems: 'center',
        }}
      >
        {DEVELOPERS.map(({ github, githubName }) => (
          <Link key={githubName} className={styles.link} href={github}>
            {githubName}
          </Link>
        ))}
      </Box>
      <Link href='https://rs.school/courses/reactjs'>
        <Box className={iconStyles.iconContainer}>
          <Image src='/rss-logo.svg' alt='rss-logo' width={40} height={40} />
        </Box>
      </Link>
    </footer>
  );
};
