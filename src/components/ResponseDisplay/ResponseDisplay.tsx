'use client';

import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
import { useTranslations } from 'next-intl';

interface ResponseDisplayProps {
  response: string;
  headers: string;
}

export default function ResponseDisplay({ response, headers }: ResponseDisplayProps) {
  const t = useTranslations('client');
  const isJson = headers && headers.includes('application/json') ? true : false

  return (
    <>
      <div>
        <h3>{t('res-body')}:</h3>
      {response ? <CodeMirror
      readOnly={true}
      value={response}
      minHeight='50px'
      height='auto'
      theme={vscodeDark}
      extensions={isJson ? [json()] : []}
    /> :  t('no-res-body')}
      </div>
      <div>
        <h3>{t('res-header')}:</h3>
        <pre>{headers ? headers : t('no-res-header')}</pre>
      </div>
    </>
  );
}
