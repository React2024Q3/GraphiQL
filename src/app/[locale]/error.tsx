'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const t = useTranslations('errors');

  return (
    <div>
      <h2>{t('error-page-msg')}</h2>
      <button onClick={() => reset()}>t('buttons.error-page')</button>
    </div>
  );
}
