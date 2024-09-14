'use client';

import { ApiResponse } from '@/types&interfaces/interfaces';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { useTranslations } from 'next-intl';

interface ResponseDisplayProps {
  response: ApiResponse | null;
  headers: string;
  statusText: string;
  statusCode: string;
}

export default function ResponseDisplay({
  response,
  headers,
  statusText,
  statusCode,
}: ResponseDisplayProps) {
  const t = useTranslations('client');
  const isJson = headers && headers.includes('application/json') ? true : false;

  return (
    <>
      <div>
        <h3>
          {t('res-statusCode')} :
          <span style={{ fontWeight: 'normal' }}> "{statusCode ? statusCode : ''}"</span>
        </h3>
      </div>

      <div>
        <h3>
          {t('res-statusText')} :
          <span style={{ fontWeight: 'normal' }}> "{statusText ? statusText : ''}"</span>
        </h3>
      </div>

      <div>
        <h3>{t('res-body')}:</h3>
        {response ? (
          <CodeMirror
            readOnly={true}
            value={isJson ? JSON.stringify(response, null, 2) : response.toString()}
            minHeight='50px'
            maxHeight='500px'
            height='auto'
            extensions={isJson ? [json()] : []}
          />
        ) : (
          t('no-res-body')
        )}
      </div>
      <div>
        <h3>{t('res-header')}:</h3>
        <pre>{headers ? headers : t('no-res-header')}</pre>
      </div>
    </>
  );
}
