import { Loader } from '@/components/Loader';
import { ResponseEditor, Spinner } from '@graphiql/react';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export function RDTGraphiQLResponseEditor(props: { isFetching: boolean; responseStatus?: number }) {
  const t = useTranslations('graphiql');
  return (
    <Box sx={{ minHeight: '270px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        {t('status')}: {props.responseStatus}
      </Box>
      <div className='graphiql-container'>
        <div className={'graphiql-response'}>
          {props.isFetching ? (
            <>
              {' '}
              <Spinner />
              <Loader />
            </>
          ) : (
            <ResponseEditor />
          )}
        </div>
      </div>
    </Box>
  );
}
