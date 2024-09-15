'use client';

import { FC } from 'react';

import { Developers } from '@/components/MainContent/Developers';
import { ProjectSection } from '@/components/MainContent/ProjectSection';
import { WelcomeSection } from '@/components/MainContent/WelcomeSection';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useHandleError } from '@/shared/hooks/useHandleError';
import { Box } from '@mui/material';

import { Loader } from '../Loader';
import { CourseSection } from './CourseSection';
import styles from './MainContent.module.css';

export const MainContent: FC = () => {
  const { loading, error } = useAuth();
  useHandleError(error);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box className={styles.main__page}>
      <WelcomeSection />
      <ProjectSection />
      <Developers />
      <CourseSection />
    </Box>
  );
};
