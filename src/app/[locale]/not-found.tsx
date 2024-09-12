import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('not-found-page');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <Link href='/'>{t('go-back')}</Link>
    </div>
  );
}
