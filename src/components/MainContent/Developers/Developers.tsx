import { FC } from 'react';

import { DEVELOPERS } from '@/shared/constants/developersInfo';
import iconStyles from '@/shared/styles/sharedStyles.module.css';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Link,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import styles from '../MainContent.module.css';

export const Developers: FC = () => {
  const t = useTranslations('Home.developers');
  const developers = DEVELOPERS.map((developer, index) => ({
    ...developer,
    name: t(`names.${index === 0 ? 'oleksii' : index === 1 ? 'diana' : 'aliaksandr'}`),
    role: `${t(`role.${index === 0 ? 'team-lead' : 'frontend-developer'}`)}${index === 0 ? `, ${t('role.frontend-developer')}` : ''}`,
  }));

  return (
    <Box className={styles.developers}>
      <Container className={styles.container}>
        <Typography variant='h5' className={styles.title}>
          {t('title')}
        </Typography>
        <Box className={styles.developers__cards}>
          {developers.map(({ name, role, image, github, linkedIn }) => (
            <Card
              sx={{
                display: 'flex',
                maxWidth: '370px',
              }}
              key={github}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography gutterBottom variant='h5' component='div'>
                    {name}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant='subtitle1'
                    component='div'
                    sx={{ color: 'text.secondary' }}
                  >
                    {role}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', gap: '0.3rem' }}>
                  <Link href={github}>
                    <Box className={iconStyles.iconContainer}>
                      <Image src='/github-icon.svg' alt='github-logo' width={20} height={20} />
                    </Box>
                  </Link>
                  <Link href={linkedIn}>
                    <Box className={iconStyles.iconContainer}>
                      <Image src='/linkedIn-icon.svg' alt='linkedIn-logo' width={20} height={20} />
                    </Box>
                  </Link>
                </CardActions>
              </Box>
              <CardMedia component='img' image={image} alt='photo' sx={{ width: 151 }} />
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
