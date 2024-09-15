import RDTGraphiQLForm from '@/components/GraphiQLForm';
import { useTranslations } from 'next-intl';

export default function GraphiQLPage({ params }: { params: { path: string[] } }) {
  const t = useTranslations();

  return (
    <>
      <h2 className='page__title'>{t('buttons.graphql')}</h2>

      <RDTGraphiQLForm path={params.path} />
    </>
  );
}
