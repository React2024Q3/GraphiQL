'use client';

import { FormEvent, useState } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import {
  GraphQLApiResponse,
  GraphQLQuery,
  composePathFromQuery,
  parseQueryFromPath,
  shallowChangeUrlInBrowser,
} from '@/data/graphQL/graphQLHelper';
import queryRM from '@/data/graphQL/queryRM.json';
import queryTODO from '@/data/graphQL/queryTODO.json';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import { KeyValuePair } from '@/types&interfaces/types';
import { urlSchema } from '@/utils/validation/helpers';
import { DocExplorer, GraphiQLProvider } from '@graphiql/react';
import '@graphiql/react/dist/style.css';
import { Fetcher, createGraphiQLFetcher } from '@graphiql/toolkit';
import { Box, Button, Container, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { ValidationError } from 'yup';

import { ErrorNotification } from '../ErrorNotification';
import KeyValueForm from '../KeyValueForm';
import styles from './RDTGraphiQLForm.module.css';
import { RDTGraphiQLRequestEditor } from './RDTGraphiQLRequestEditor';
import { RDTGraphiQLResponseEditor } from './RDTGraphiQLResponseEditor';
import './missingGraphiQLStyles.css';

const exampleQueries = ['None', 'Rick&Morty', 'TODO app'];
interface GraphQLFormUIState {
  url: string;
  query: string;
  queryVariables: string;
  requestHeaders: KeyValuePair[];
  isFetching: boolean;
  response: GraphQLApiResponse;
  urlTexFieldValue: string;
  urlTextFieldError: string;
  selectedExampleQueryName: string;
  tabIndex: number;
  editorVariables: KeyValuePair[];
}

const defaultFormUIState: GraphQLFormUIState = {
  url: '',
  query: '',
  queryVariables: '{}',
  requestHeaders: [{ key: 'content-type', value: 'application/json', editable: true }],

  isFetching: false,
  response: { data: {} },

  urlTexFieldValue: '',
  urlTextFieldError: '',
  selectedExampleQueryName: 'None',
  tabIndex: 0,

  editorVariables: [{ key: 'myvar', value: 'myvalue', editable: true }],
};

export default function RDTGraphiQLForm({ path }: { path: string[] }) {
  const [url, setUrl] = useState(defaultFormUIState.url);

  // const fetcher = useRef<Fetcher | null>(null);

  const [query, setQuery] = useState(defaultFormUIState.query);
  const [queryVariables, setQueryVariables] = useState(defaultFormUIState.queryVariables);
  const [requestHeaders, setRequestHeaders] = useState(defaultFormUIState.requestHeaders);

  // manually fetching GraphQL request through API Handler on server,
  // not using createGraphiQLFetcher from @graphiQL fro requests (only for schema)
  const [isFetching, setIsFetching] = useState(false);
  const [response, setResponse] = useState<GraphQLApiResponse>(defaultFormUIState.response);

  const [urlTextFieldValue, setUrlTextFieldValue] = useState(defaultFormUIState.urlTexFieldValue);
  const [urlTextFieldError, setUrlTextFieldError] = useState(defaultFormUIState.urlTextFieldError);
  const [selectedExampleQueryName, setSelectedExampleQueryName] = useState(
    defaultFormUIState.selectedExampleQueryName
  );
  const [tabIndex, setTabIndex] = useState(defaultFormUIState.tabIndex);

  const [keyValuePairsVar, setKeyValuePairsVar] = useState(defaultFormUIState.editorVariables);

  const searchParams = useSearchParams();
  const [_, saveUrlToLS] = useHistoryLS();

  const isFirstRender = useRef(true);

  // GraphQL Editor won't render/work unless URL (and hence schema) is set
  const memoFetcher: Fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: url,
      }),
    [url]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const query = parseQueryFromPath(path, searchParams);
      if (query) {
        applyFormUIState(getFormUIStateForQuery(query));
      }
    }
  }, [path, searchParams]);

  const getFormUIStateForQuery = (
    query: GraphQLQuery,
    selectedExampleQuery?: string
  ): GraphQLFormUIState => {
    const state = { ...defaultFormUIState };
    state.url = query.url;
    state.urlTexFieldValue = query.url;
    state.query = query.query;
    state.queryVariables = query.queryVariables;
    if (query.headers) {
      state.requestHeaders = query.headers;
    }
    if (selectedExampleQuery) {
      state.selectedExampleQueryName = selectedExampleQuery;
    }
    return state;
  };

  const applyFormUIState = (state: GraphQLFormUIState) => {
    setUrl(state.url);
    setQuery(state.query);
    setQueryVariables(state.queryVariables);
    setRequestHeaders(state.requestHeaders);

    setIsFetching(state.isFetching);
    setResponse(state.response);

    setUrlTextFieldValue(state.urlTexFieldValue);
    setUrlTextFieldError(state.urlTextFieldError);

    setSelectedExampleQueryName(state.selectedExampleQueryName);
    setTabIndex(state.tabIndex);

    setKeyValuePairsVar(state.editorVariables);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handlePairsChangeHeader = (newPairs: KeyValuePair[]) => {
    setRequestHeaders(newPairs);
  };

  const handlePairsChangeVar = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsVar(newPairs);
  };

  const validateURLTextField = (text: string) => {
    try {
      urlSchema.validateSync(text);
      // clear error if valid
      setUrlTextFieldError('');
      return true;
    } catch (error) {
      console.log(`value: ${text} is not valie dut to ${error}`);
      if (error instanceof ValidationError) {
        setUrlTextFieldError(error.message); // Set error message if validation fails
      } else {
        setUrlTextFieldError('URL is not valid');
      }
      return false;
    }
  };

  const handleURLTextFieldBlur = () => {
    const inputIsValid = validateURLTextField(urlTextFieldValue);
    if (inputIsValid) {
      setUrl(urlTextFieldValue);
    }
  };

  const handleURLTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlTextFieldValue(event.target.value);
    validateURLTextField(event.target.value);
  };

  // useEffect(() => {
  //   fetcher.current = createGraphiQLFetcher({
  //     url: url,
  //   });
  // }, [url]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setResponse({ data: {} });

    const path = composePathFromQuery({
      url: url,
      query: query,
      queryVariables: queryVariables,
      headers: requestHeaders,
    });
    const browserPath = `graphiql/${path}`;
    shallowChangeUrlInBrowser(browserPath);
    saveUrlToLS(browserPath);

    try {
      //const response = await fetch(`/api/GRAPHQL/${encodedUrl}/${encodedBody}`, { method: 'POST' });
      const response = await fetch(`/api/GRAPHQL/${path}`, { method: 'POST' });

      try {
        const data = await response.json();
        setResponse({ status: response.status, data: data });
      } catch (e) {
        console.error(e);
        setResponse({ status: response.status, errorMessage: 'Server returned not valid JSON' });
      }

      setIsFetching(false);
    } catch (e) {
      //network and CORS errors
      let message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = String(e);
      }
      console.log(message);

      setResponse({ networkError: new Error('Please check your network and CORS settings') });
      setIsFetching(false);
    }
  };

  const handleExampleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setSelectedExampleQueryName(e.target.value);

    let selectedExampleQuery: GraphQLQuery | null;
    switch (e.target.value) {
      case exampleQueries[0]: {
        selectedExampleQuery = null;
        break;
      }
      case exampleQueries[1]: {
        selectedExampleQuery = {
          url: queryRM.url,
          query: queryRM.query,
          queryVariables: JSON.stringify(queryRM.queryVariables),
          headers: queryRM.headers,
        };
        break;
      }
      case exampleQueries[2]: {
        selectedExampleQuery = {
          url: queryTODO.url,
          query: queryTODO.query,
          queryVariables: JSON.stringify(queryTODO.queryVariables),
          headers: queryTODO.headers,
        };
        break;
      }
      default: {
        selectedExampleQuery = null;
      }
    }

    let formUIState = { ...defaultFormUIState };
    if (selectedExampleQuery) {
      formUIState = getFormUIStateForQuery(selectedExampleQuery, e.target.value);
    }
    applyFormUIState(formUIState);
  };

  const onQueryEdit = (value: string) => {
    setQuery(value);
  };

  const onQueryVariablesEdit = (value: string) => {
    setQueryVariables(value);
  };

  //console.log(`GraphiQLForm rerender and response is set as ${JSON.stringify(response?.data, null, 2)}`);

  return (
    <Container className={styles.formContainer}>
      <ErrorNotification error={response?.networkError} />

      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '0.5rem' }}
      >
        <TextField
          id='standard-basic'
          sx={{ width: '75%' }}
          value={urlTextFieldValue}
          onChange={handleURLTextFieldChange}
          label='URL'
          error={!!urlTextFieldError}
          helperText={urlTextFieldError}
          onBlur={handleURLTextFieldBlur}
        />
        <TextField
          select
          size='medium'
          sx={{ width: '200px' }}
          label='Query example'
          value={selectedExampleQueryName}
          onChange={handleExampleQueryChange}
        >
          <MenuItem value={exampleQueries[0]}>{exampleQueries[0]}</MenuItem>
          <MenuItem value={exampleQueries[1]}>{exampleQueries[1]}</MenuItem>
          <MenuItem value={exampleQueries[2]}>{exampleQueries[2]}</MenuItem>
        </TextField>
        <Button
          variant='contained'
          disabled={isFetching}
          sx={{ width: '200px' }}
          onClick={handleSubmit}
        >
          Run
        </Button>
      </Box>

      <GraphiQLProvider
        fetcher={memoFetcher}
        query={query}
        variables={queryVariables}
        response={JSON.stringify(response?.data, null, 2)}
        // headers={JSON.stringify(requestHeaders)}
        // setting headers messes up default Introspection query for some APIs due to cors.
        // @graphiql fetches the schema automatically, on the client
        // TODO: make a server action to fetch schema on our server and pass it to
        // the provider via schema props here

        // if we don't have URL yet - then we should skip introspection query (which will
        // return an error otherwise) by setting schema to `null` explicitly.
        // if the url is provided - then we set `schema: undefined` and graphiql will make
        // introspection query automatically and load the schema. we should aim to provide schema manually via our server action in future
        schema={url === defaultFormUIState.url ? null : undefined}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label='basic tabs example'>
              <Tab label='Query' />
              <Tab label='Headers' />
              <Tab label='Variables' />
              <Tab label='Documentation' />
            </Tabs>
          </Box>

          <Box className={styles.tabWrapWindow}>
            <Box className={styles.tabWrap} style={{ transform: `translateX(${-tabIndex * 25}%)` }}>
              <Box sx={{ width: '25%', maxHeight: '400px' }} className='graphiql-container'>
                <RDTGraphiQLRequestEditor
                  onQueryEdit={onQueryEdit}
                  onQueryVariablesEdit={onQueryVariablesEdit}
                ></RDTGraphiQLRequestEditor>
              </Box>

              <Box sx={{ width: '25%', maxHeight: '400px' }}>
                <KeyValueForm
                  onPairsChange={handlePairsChangeHeader}
                  title={'Headers'}
                  initPairs={requestHeaders}
                  height='none'
                />
              </Box>

              <Box sx={{ width: '25%', maxHeight: '400px' }}>
                <KeyValueForm
                  onPairsChange={handlePairsChangeVar}
                  title={'Variables'}
                  initPairs={keyValuePairsVar}
                  height='none'
                />
              </Box>

              <Box
                sx={{ width: '25%', maxHeight: '400px', overflow: 'scroll' }}
                className='graphiql-container'
              >
                <DocExplorer></DocExplorer>
              </Box>
            </Box>
          </Box>
        </form>

        <RDTGraphiQLResponseEditor
          isFetching={isFetching}
          responseStatus={response?.status}
        ></RDTGraphiQLResponseEditor>
      </GraphiQLProvider>
    </Container>
  );
}
