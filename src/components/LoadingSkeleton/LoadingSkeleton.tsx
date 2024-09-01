import { FC } from 'react';

import { Skeleton, Typography } from '@mui/material';

import { LoadingSkeletonProps } from './types';

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  typographyVariant = 'h4',
  className = '',
  ...props
}) => (
  <Skeleton className={className} variant={variant} width={width} {...props}>
    {variant === 'text' && <Typography variant={typographyVariant}>'.'</Typography>}
  </Skeleton>
);
