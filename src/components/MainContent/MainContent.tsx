import { FC } from 'react';

import { Developers } from '@/components/MainContent/Developers';
import { ProjectSection } from '@/components/MainContent/ProjectSection';
import { WelcomeSection } from '@/components/MainContent/WelcomeSection';
import { Box } from '@mui/material';

import { CourseSection } from './CourseSection';
import styles from './MainContent.module.css';

export const MainContent: FC = () => {
  return (
    <Box className={styles.main__page}>
      <WelcomeSection />
      <ProjectSection />
      <Developers />
      <CourseSection />
    </Box>
  );
};
