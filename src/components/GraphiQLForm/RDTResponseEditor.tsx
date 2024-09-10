import { Loader } from '@/components/Loader';
import { ResponseEditor, Spinner } from '@graphiql/react';
import { Box } from '@mui/material';

export function RDTResponseEditor(props: { isFetching: boolean; responseStatus?: number }) {
  return (
    <Box sx={{ minHeight: '270px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        Status: {props.responseStatus}
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
