import { FC } from 'react';

import { LinearProgress } from '@mui/material';

import styles from './Loader.module.css';

export const Loader: FC = () => {
  return <LinearProgress className={styles.loader} />;
};
