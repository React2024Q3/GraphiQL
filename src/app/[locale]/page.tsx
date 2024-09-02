import { UserName } from '@/components/UserName';
import { Container } from '@mui/material';

import styles from './page.module.css';

export default function Home() {
  return (
    <Container className={styles.main__page}>
      <UserName />
    </Container>
  );
}
