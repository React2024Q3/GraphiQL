import RDTGraphiQLForm from '@/components/GraphiQLForm';

export default function GraphiQLPage({ params }: { params: { path: string[] } }) {
  return (
    <>
      <RDTGraphiQLForm path={params.path} />
    </>
  );
}
