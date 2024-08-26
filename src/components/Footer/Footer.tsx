import { FC } from 'react';

import { Link } from '@/navigation';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import styles from './Footer.module.css';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <Typography className={styles.year} variant='body2'>
        &copy; 2024
      </Typography>
      <Box className={styles.footer__container}>
        <Link className={styles.link} href='https://github.com/BolotinAlexey'>
          BolotinAlexey
        </Link>
        <Link className={styles.link} href='https://github.com/Diana2886'>
          Diana2886
        </Link>
        <Link className={styles.link} href='https://github.com/freennnn'>
          alex.pranevich
        </Link>
      </Box>
      <Link href='https://rs.school/courses/reactjs'>
        <Image src='/rss-logo.svg' alt='rss-logo' width={40} height={40} />
      </Link>
    </footer>
  );
};
