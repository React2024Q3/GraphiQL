import RestForm from '@/components/RestForm';
import { redirect } from '@/navigation';
import { ARRAY_METHODS } from '@/shared/constants';
import { MethodType } from '@/types&interfaces/types';

export default function RestPage({ params }: { params: { method: MethodType; path: string[] } }) {
  if (!ARRAY_METHODS.includes(params.method.toUpperCase())) redirect('/404');

  return (
    <>
      <h2 className='page__title'>Rest Page</h2>

      <RestForm initMethod={params.method} path={params.path} />
    </>
  );
}
