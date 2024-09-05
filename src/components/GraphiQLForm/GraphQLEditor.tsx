'use client';

import { useMemo, useState } from 'react';
import { useEffect } from 'react';

// Include default styles
import { DocExplorer, GraphiQLProvider, QueryEditor, VariableEditor } from '@graphiql/react';
import '@graphiql/react/dist/style.css';
import { Fetcher, createGraphiQLFetcher } from '@graphiql/toolkit';
import { Box } from '@mui/material';

import styles from './graphQLEditor.module.css';

export const GraphQLEditor = ({ url, initialQuery, initialQueryVariables }: { url: string; initialQuery: string; initialQueryVariables: string }) => {
  // const anotherFetcher = createGraphiQLFetcher({
  //   url: 'https://my.graphql.api/graphql',
  // });

  // const f = createGraphiQLFetcher({
  //   url: 'https://rickandmortyapi.com/graphql',
  // });

  // const f =  createGraphiQLFetcher({
  //   url: 'https://rickandmortyapi.com/graphql',
  // })
  //console.log(f);
  const memoFetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: url,
      }),
    [url]
  );

  // const [fetcher, setFetcher] = useState<Fetcher | null>(null);
  // useEffect(() => {
  //   console.log(url);
  //   if (url) {
  //     const createFetcher = createGraphiQLFetcher({
  //       url: url,
  //     })
  //     console.log(createFetcher);
  //     setFetcher(createFetcher);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (url) {
  //     const createFetcher = createGraphiQLFetcher({
  //       url: url,
  //     })
  //     console.log(createFetcher);
  //     setFetcher(createFetcher);
  //   }
  // }, [url]); //url

  return (
    //  fetcher ? (
    <GraphiQLProvider fetcher={memoFetcher} query={initialQuery} variables={initialQueryVariables}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}> */}
      <div className='graphiql-container'>
        <div className={styles['query-and-vars-box']}>
          <div className={styles['query-editor']}>
            <QueryEditor></QueryEditor>
          </div>
          <div className={styles['variables-editor']}>
            <VariableEditor></VariableEditor>
          </div>
        </div>
        <DocExplorer></DocExplorer>
      </div>
    </GraphiQLProvider>
    //  ) : (
    //    <div>Loading</div>
    //  ));
  );
};

// const view = new EditorView({
//   doc: `mutation mutationName {
//     setString(value: "newString")
//   }`,
//   extensions: [basicSetup, graphql(myGraphQLSchema)],
//   parent: document.body,
// });
