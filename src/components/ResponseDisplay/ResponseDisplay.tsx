'use client';

import { useTranslations } from 'next-intl';

interface ResponseDisplayProps {
  response: string;
  headers: string;
}

export default function ResponseDisplay({ response, headers }: ResponseDisplayProps) {
  const t = useTranslations('client');

  return (
    <>
      <div>
        <h3>{t('res-body')}:</h3>
        <pre>{response ? response : t('no-res-body')}</pre>
      </div>
      <div>
        <h3>{t('res-header')}:</h3>
        <pre>{headers ? headers : t('no-res-header')}</pre>
      </div>
    </>
  );
}
