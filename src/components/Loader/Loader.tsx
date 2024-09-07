import { FC } from 'react';

import { LinearProgress } from '@mui/material';

export const Loader: FC = () => {
  return (
    <LinearProgress
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
      }}
    />
  );
};
