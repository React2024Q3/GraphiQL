import { Loader } from '@/components/Loader';
import { ResponseEditor, Spinner } from '@graphiql/react';
import { Box } from '@mui/material';

export function RDTResponseEditor(props: { isFetching: boolean }) {
  return (
    <Box sx={{ minHeight: '200px', display: 'flex' }} className='graphiql-container'>
      <div className={'graphiql-response'}>
        {props.isFetching ?<> <Spinner /><Loader/></> :<ResponseEditor/> }
      </div>
    </Box>
  );
}
