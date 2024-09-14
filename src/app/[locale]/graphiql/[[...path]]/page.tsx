import RDTGraphiQLForm from '@/components/GraphiQLForm';
import ClientOnly from '@/components/GraphiQLForm/ClientOnly';

export default function GraphiQLPage({ params }: { params: { path: string[] } }) {
  return (
    <>
      <ClientOnly>
        <RDTGraphiQLForm path={params.path} />
      </ClientOnly>
    </>
  );
}
