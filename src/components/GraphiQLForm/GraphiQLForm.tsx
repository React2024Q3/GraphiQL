'use client';

import { FormEvent, useState } from 'react';
import { useEffect, useRef } from 'react';

import {
  composeGraphQLPostRequestBody,
  parseRequestHeadersString,
} from '@/data/graphQL/graphQLHelper';
import type { GraphQLQueryType } from '@/data/graphQL/graphQLQueryType';
import queryRM from '@/data/graphQL/queryRM.json';
import queryTODO from '@/data/graphQL/queryTODO.json';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import ResponseDisplay from '../ResponseDisplay';
//import { graphql } from 'cm6-graphql';
//import { EditorView, basicSetup } from 'codemirror';
import { GraphQLEditor } from './GraphQLEditor';

export default function GraphiQLForm() {
  const [url, setUrl] = useState<string>('');
  // const fetcher = useRef<Fetcher | null>(null);

  const [query, setQuery] = useState<string>('');
  const [queryVariables, setQueryVariables] = useState<string>('{}');

  const [requestHeaders, setRequestHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
  });
  const [responseData, setResponseData] = useState<JSON>();

  const [responseHeaders, setResponseHeaders] = useState<string>('');

  const exampleQueries = ['Rick&Morty', 'TODO app'];

  const handleExampleQueryChange = (e: SelectChangeEvent) => {
    let selectedExampleQuery;
    switch (e.target.value) {
      case exampleQueries[0]: {
        selectedExampleQuery = queryRM;
        break;
      }
      case exampleQueries[1]: {
        selectedExampleQuery = queryTODO;
        break;
      }
      default: {
        selectedExampleQuery = queryRM;
      }
    }

    setUrl(selectedExampleQuery.url);
    setQuery(selectedExampleQuery.query);
    //console.log(JSON.stringify(selectedExampleQuery.queryVariables));
    setQueryVariables(JSON.stringify(selectedExampleQuery.queryVariables));
    //console.log(`queryVariables: ${queryVariables}`);
    if ('headers' in selectedExampleQuery) {
      setRequestHeaders(parseRequestHeadersString(selectedExampleQuery['headers'] as string));
    }
  };

  // useEffect(() => {
  //   fetcher.current = createGraphiQLFetcher({
  //     url: url,
  //   });
  // }, [url]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const encodedUrl = encodeURIComponent(btoa(url));
    const encodedBody = encodeURIComponent(
      btoa(composeGraphQLPostRequestBody(query, queryVariables))
    );
    try {
      console.log('sending request to our api route');
      const response = await fetch(`api/GRAPHQL/${encodedUrl}/${encodedBody}`, { method: 'POST' });
      console.log(`responsik status: $responsik.status`);
      const data = await response.json();

      console.log(`client received data: ${data}`);

      setResponseData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FormControl>
        <InputLabel id='example-query-select-label'>Query example</InputLabel>
        <Select
          labelId='example-query-select-label'
          id='example-query-select'
          value={''}
          label='Query example'
          onChange={handleExampleQueryChange}
        >
          <MenuItem value={exampleQueries[0]}>{exampleQueries[0]}</MenuItem>
          <MenuItem value={exampleQueries[1]}>{exampleQueries[1]}</MenuItem>
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            URL:
            <input type='text' value={url} onChange={(e) => setUrl(e.target.value)} required />
          </label>
        </div>
        <GraphQLEditor url={url} initialQuery={query}></GraphQLEditor>
        <div>
          <label>
            Query:
            <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} required />
          </label>
        </div>

        <button type='submit'>Send request</button>
      </form>
      <ResponseDisplay headers={responseHeaders} response={JSON.stringify(responseData, null, 2)} />
    </div>
  );
}
