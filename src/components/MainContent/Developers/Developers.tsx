import { FC } from 'react';

import { DEVELOPERS } from '@/shared/constants/developersInfo';
import {
  Box, //   Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Link,
  Typography,
} from '@mui/material';
import Image from 'next/image';

import styles from '../MainContent.module.css';

export const Developers: FC = () => {
  return (
    <Box className={styles.developers}>
      <Container className={styles.container}>
        <Typography variant='h5' className={styles.title}>
          Developers
        </Typography>
        <Box className={styles.developers__cards}>
          {DEVELOPERS.map(({ name, role, image, github, linkedIn }) => (
            <Card
              sx={{
                display: 'flex',
                maxWidth: '370px',
                backgroundColor: 'var(--mui-palette-grey-100)',
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
                    <Image src='/github-icon.svg' alt='github-logo' width={20} height={20} />
                  </Link>
                  <Link href={linkedIn}>
                    <Image src='/linkedIn-icon.svg' alt='linkedIn-logo' width={20} height={20} />
                  </Link>
                  {/* <Link href={github}>
                  <Button size='small' color='primary' className='button'>
                    Github
                  </Button>
                </Link>
                <Link href={linkedIn}>
                  <Button size='small' color='primary' className='button'>
                    LinkedIn
                  </Button>
                </Link> */}
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
