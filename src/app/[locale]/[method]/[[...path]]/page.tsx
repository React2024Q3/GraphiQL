import RestForm from '@/components/RestForm';
import { redirect } from '@/navigation';
import { ARRAY_METHODS } from '@/shared/constants';
import { MethodType } from '@/types&interfaces/types';
import { useTranslations } from 'next-intl';

export default function RestPage({ params }: { params: { method: MethodType; path: string[] } }) {
  const t = useTranslations();

  if (!ARRAY_METHODS.includes(params.method.toUpperCase())) redirect('/404');

  return (
    <>
      <h2 className='page__title'>{t('buttons.rest')}</h2>

      <RestForm initMethod={params.method.toUpperCase() as MethodType} path={params.path} />
    </>
  );
}
