import RestForm from '@/components/RestForm';

export default function RestPage({ params }: { params: { path: string[] } }) {
  return (
    <>
      <h2 className='page__title'>Rest Page</h2>

      <RestForm path={params.path} />
    </>
  );
}
