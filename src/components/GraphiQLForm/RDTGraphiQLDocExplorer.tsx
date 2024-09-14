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
    } catch (e) {
      console.error('Error fetching GraphQL schema:', e);
    }
    setIsFetching(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
        <TextField
          id='standard-basic'
          sx={{ flexGrow: 5 }}
          value={SDLUrl}
          onChange={(e) => setSDLUrl(e.target.value)}
          label={t('sdlUrlLabel')}
          inputRef={urlInputRef}
        />
        <Button
          variant='contained'
          disabled={isFetching}
          sx={{ flexGrow: 0 }}
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
