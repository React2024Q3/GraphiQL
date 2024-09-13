import { QueryEditor, VariableEditor, usePrettifyEditors } from '@graphiql/react';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from './RDTGraphiQLRequestEditor.module.css';

export function RDTGraphiQLRequestEditor(props: {
  onQueryEdit: (value: string) => void;
  onQueryVariablesEdit: (value: string) => void;
}) {
  const prettify = usePrettifyEditors();
  const t = useTranslations('graphiql');

  return (
    <>
      {/* <div className='graphiql-container'> */}
      <div className={styles['query-and-vars-box']}>
        <div className={styles['query-editor']}>
          <QueryEditor onEdit={props.onQueryEdit}></QueryEditor>
        </div>
        <div className={styles['variables-editor']}>
          <VariableEditor onEdit={props.onQueryVariablesEdit}></VariableEditor>
        </div>
      </div>
      <Button
        variant='contained'
        sx={{ width: '250px', whiteSpace: 'pre-line', marginBottom: '1rem' }}
        onClick={prettify}
      >
        {t('prettifyButton')}
      </Button>
    </>
  );
}
