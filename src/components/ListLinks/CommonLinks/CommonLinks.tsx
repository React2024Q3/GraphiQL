import { Link } from '@/navigation';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

export function CommonLinks() {
  const t = useTranslations('buttons');
  return (
    <>
      <li>
        <Link href='/rest'>
          <Button variant='contained'>{t('rest')}</Button>
        </Link>
      </li>
      <li>
        <Link href='/graphiql'>
          <Button variant='contained'>{t('graphql')}</Button>
        </Link>
      </li>
    </>
  );
}
