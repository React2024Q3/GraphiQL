import React, { useEffect } from 'react';
import { useState } from 'react';

import { Loader } from '@/components/Loader';
import { getSchema } from '@/data/serverActions/getSchema';
import { DocExplorer, Spinner } from '@graphiql/react';
import { Box, Button, TextField } from '@mui/material';
import { GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import { useTranslations } from 'next-intl';

export default function RDTGraphiQLDocExplorer({
  baseURL,
  onCustomSchemaFetch,
}: {
  baseURL: string;
  onCustomSchemaFetch: (schema: GraphQLSchema) => void;
}) {
  console.log(`baseURL: ${baseURL}`);
  const [isFetching, setIsFetching] = useState(false);
  const t = useTranslations('graphiql');
  const urlInputRef = React.useRef<HTMLInputElement>(null);

  const [SDLUrl, setSDLUrl] = useState(baseURL + '?sdl');

  useEffect(() => {
    setSDLUrl(baseURL + '?sdl');
  }, [baseURL]);

  const handleSchemaFetch = async () => {
    setIsFetching(true);

    const schemaJSON = await getSchema(SDLUrl);
    try {
      if (!schemaJSON) {
        throw new Error('Invalid schema');
      }
      const schema = buildClientSchema(schemaJSON as unknown as IntrospectionQuery);
      onCustomSchemaFetch(schema);
      console.log(schema);
    } catch (e) {
      console.error('Error fetching GraphQL schema:', e);
    }
    setIsFetching(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <TextField
          id='standard-basic'
          sx={{ width: '75%' }}
          value={SDLUrl}
          onChange={(e) => setSDLUrl(e.target.value)}
          label={t('sdlUrlLabel')}
          inputRef={urlInputRef}
        />
        <Button
          variant='contained'
          disabled={isFetching}
          sx={{ width: '200px' }}
          onClick={handleSchemaFetch}
        >
          {t('fetchSDLButton')}
        </Button>
      </Box>
      {isFetching ? (
        <>
          <Spinner />
          <Loader />
        </>
      ) : (
        <div className='graphiql-container'>
          <DocExplorer />
        </div>
      )}
    </>
  );
}
