import { ApiResponse } from '@/types&interfaces/interfaces';
import transformStatusCodeToColor from '@/utils/transformStatusCodeToColor';
import { json } from '@codemirror/lang-json';
import { Box } from '@mui/material';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
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
  const isJson = headers && headers.includes('application/json');

  const statusColor = transformStatusCodeToColor(statusCode);

  const getResponseBodyAsString = (response: ApiResponse | null): string => {
    if (response === null) {
      return t('no-res-body');
    }

    if (typeof response === 'object') {
      if ('data' in response) {
        return JSON.stringify(response.data, null, 2);
      }

      return JSON.stringify(response, null, 2);
    }

    return String(response);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3>
          {t('res-statusCode')} :
          <span className='stroke' style={{ color: `${statusColor}` }}>
            {' '}
            "{statusCode ? statusCode : ''}"
          </span>
        </h3>
      </div>

      <div>
        <h3>
          {t('res-statusText')} :
          <span className='stroke' style={{ color: `${statusColor}` }}>
            {' '}
            "{statusText ? statusText : ''}"
          </span>
        </h3>
      </div>

      <div>
        <h3>{t('res-body')}:</h3>
        {response !== null ? (
          <CodeMirror
            readOnly={true}
            value={getResponseBodyAsString(response)}
            minHeight='50px'
            maxHeight='500px'
            height='auto'
            theme={vscodeDark}
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
    </Box>
  );
}
