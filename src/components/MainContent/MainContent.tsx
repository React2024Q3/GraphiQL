'use client';

import { FC } from 'react';

import { Developers } from '@/components/MainContent/Developers';
import { ProjectSection } from '@/components/MainContent/ProjectSection';
import { WelcomeSection } from '@/components/MainContent/WelcomeSection';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { Box } from '@mui/material';

import { ErrorNotification } from '../ErrorNotification';
import { Loader } from '../Loader';
import { CourseSection } from './CourseSection';
import styles from './MainContent.module.css';

export const MainContent: FC = () => {
  const { loading, error } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Box className={styles.main__page}>
      <WelcomeSection />
      <ProjectSection />
      <Developers />
      <CourseSection />
      <ErrorNotification error={error} />
    </Box>
  );
};
