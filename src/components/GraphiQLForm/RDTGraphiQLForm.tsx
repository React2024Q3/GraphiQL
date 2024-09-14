'use client';

import { FormEvent, useState } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import {
  GraphQLApiResponse,
  GraphQLQuery,
  composeStatePathFromQuery,
  parseQueryFromPath,
  shallowChangeUrlInBrowser,
} from '@/data/graphQL/graphQLHelper';
import queryRM from '@/data/graphQL/queryRM.json';
import queryTODO from '@/data/graphQL/queryTODO.json';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import useVariablesLS from '@/shared/hooks/useVariablesLS';
import { KeyValuePair } from '@/types&interfaces/types';
import { urlSchema } from '@/utils/validation/helpers';
import { GraphiQLProvider } from '@graphiql/react';
import '@graphiql/react/dist/style.css';
import { Fetcher, createGraphiQLFetcher } from '@graphiql/toolkit';
import { Box, Button, Container, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { GraphQLSchema } from 'graphql';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ValidationError } from 'yup';

import { ErrorNotification } from '../ErrorNotification';
import KeyValueForm from '../KeyValueForm';
import { Loader } from '../Loader';
import RDTGraphiQLDocExplorer from './RDTGraphiQLDocExplorer';
import styles from './RDTGraphiQLForm.module.css';
import { RDTGraphiQLRequestEditor } from './RDTGraphiQLRequestEditor';
import { RDTGraphiQLResponseEditor } from './RDTGraphiQLResponseEditor';
import './missingGraphiQLStyles.css';

const exampleQueries = ['--', 'Rick&Morty', 'TODO app'];
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
  customSchema: GraphQLSchema | null;
}

const defaultFormUIState: GraphQLFormUIState = {
  url: '',
  query: '',
  queryVariables: '{}',
  requestHeaders: [{ key: 'content-type', value: 'application/json', editable: false }],

  isFetching: false,
  response: { data: {} },

  urlTexFieldValue: '',
  urlTextFieldError: '',
  selectedExampleQueryName: '--',
  tabIndex: 0,
  customSchema: null,
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
  const [customSchema, setCustomSchema] = useState<GraphQLSchema | null>(null);

  const [urlTextFieldValue, setUrlTextFieldValue] = useState(defaultFormUIState.urlTexFieldValue);
  const [urlTextFieldError, setUrlTextFieldError] = useState(defaultFormUIState.urlTextFieldError);
  const [selectedExampleQueryName, setSelectedExampleQueryName] = useState(
    defaultFormUIState.selectedExampleQueryName
  );
  const [tabIndex, setTabIndex] = useState(defaultFormUIState.tabIndex);

  const [keyValuePairsVar, setKeyValuePairsVar] = useState<KeyValuePair[]>([]);
  const [vars] = useVariablesLS();

  const searchParams = useSearchParams();
  const [_, saveUrlToLS] = useHistoryLS();
  const { loading: isAuthLoading, error: authError } = useAuthRedirect();

  const isFirstRender = useRef(true);
  const t = useTranslations('graphiql');

  // GraphQL Editor won't render/work unless URL (and hence schema) is set;
  // createGraphiQLFetcher checks window.fetch existence, assuming fetch is not available on server
  // our ssr happens on node18+ with fetch available, so we assure createGraphiQLFetcher it exists and
  // don't event need 'isomorphic-fetch' or 'node-fetch' for that.
  const memoFetcher: Fetcher = useMemo(() => {
    if (typeof window === 'undefined') {
      return createGraphiQLFetcher({
        fetch: fetch,
        url: url,
      });
    } else {
      return createGraphiQLFetcher({
        url: url,
      });
    }
  }, [url]);

  // the way we update URL in browser (via history.pushState) shouldn't trigger re-render of the component
  // and path or searchParams change. Adding isFirstRender ref to be sure we don't re-render on every url change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const query = parseQueryFromPath(path, searchParams);
      if (query) {
        applyFormUIState(getFormUIStateForQuery(query));
      }
    }
  }, [path, searchParams]);

  useEffect(() => {
    setKeyValuePairsVar(vars.map(({ key, value }) => ({ key, value, editable: false })));
  }, [vars]);

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
    state.customSchema = null;
    return state;
  };

  // skipping editor variabales aka KeyValuePairsVar, as they are stored per editor instance, not per particular query
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

    setCustomSchema(state.customSchema);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handlePairsChangeHeader = (newPairs: KeyValuePair[]) => {
    setRequestHeaders(newPairs);
    const statePath = composeStatePath(url, query, queryVariables, newPairs);
    if (statePath) {
      updateUrlInBrowser(statePath);
    }
  };

  const handlePairsChangeVar = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsVar(newPairs);
    const statePath = composeStatePath(url, query, queryVariables, requestHeaders, newPairs);
    if (statePath) {
      updateUrlInBrowser(statePath);
    }
  };

  const updateUrlInBrowser = (encodedStatePath: string) => {
    const browserURL = `/graphiql/${encodedStatePath}`;
    shallowChangeUrlInBrowser(browserURL);
    return browserURL;
  };

  const composeStatePath = (
    urlArg?: string,
    queryArg?: string,
    queryVariablesArg?: string,
    headersArg?: KeyValuePair[],
    editorVariablesArg?: KeyValuePair[]
  ) => {
    const encodedStatePath = composeStatePathFromQuery(
      {
        url: urlArg || url,
        query: queryArg || query,
        queryVariables: queryVariablesArg || queryVariables,
        headers: headersArg || requestHeaders,
      },
      editorVariablesArg || keyValuePairsVar
    );
    return encodedStatePath;
  };

  const validateURLTextField = (text: string) => {
    try {
      urlSchema.validateSync(text);
      // clear error if valid
      setUrlTextFieldError('');
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        setUrlTextFieldError(t(error.message)); // Set error message if validation fails
      } else {
        setUrlTextFieldError(t('urlNotValid'));
      }
      return false;
    }
  };

  const handleURLTextFieldBlur = () => {
    const inputIsValid = validateURLTextField(urlTextFieldValue);
    if (inputIsValid) {
      setUrl(urlTextFieldValue);
    }
    const statePath = composeStatePath(
      urlTextFieldValue // passing url arg cause url state is not updated in current render yet
    );
    if (statePath) {
      updateUrlInBrowser(statePath);
    }
  };

  const handleURLTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlTextFieldValue(event.target.value);
    validateURLTextField(event.target.value);
  };

  const handleRequestEditorBlur = () => {
    const statePath = composeStatePath();
    if (statePath) {
      updateUrlInBrowser(statePath);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setResponse(defaultFormUIState.response);

    const statePath = composeStatePath();
    if (statePath) {
      const browserUrl = updateUrlInBrowser(statePath);
      saveUrlToLS(browserUrl);

      try {
        //const response = await fetch(`/api/GRAPHQL/${encodedUrl}/${encodedBody}`, { method: 'POST' });
        const response = await fetch(`/api/GRAPHQL/${statePath}`, { method: 'POST' });

        try {
          const data = await response.json();
          setResponse({ status: response.status, data: data });
        } catch (e) {
          console.error(`Can't parse JSON returned by our server with error=${e}`);
          setResponse({
            status: response.status,
            errorMessage: 'Server returned not valid JSON',
            data: { result: 'Server returned not valid JSON' },
          });
        }
        setIsFetching(false);
      } catch (e) {
        //network and CORS errors (on a way to our server)
        let message;
        if (e instanceof Error) {
          message = e.message;
        } else {
          message = String(e);
        }
        console.error(`error on our server ${message}`);
        setResponse({ networkError: new Error('Please check your network and CORS settings') });
        setIsFetching(false);
      }
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

  const onCustomSchemaFetch = (schema: GraphQLSchema) => {
    setCustomSchema(schema);
  };

  if (isAuthLoading) {
    return <Loader />;
  }
  return (
    <Container className={styles.formContainer}>
      <ErrorNotification error={response?.networkError} />
      <ErrorNotification error={authError} />
      <GraphiQLProvider
        fetcher={memoFetcher}
        query={query}
        variables={queryVariables}
        response={JSON.stringify(response?.data, null, 2)}
        // setting headers in Provider messes up default Introspection query for some APIs due to cors.
        // headers={JSON.stringify(requestHeaders)}

        // if we loaded custom Schema (via server action from custom SDL url) then we set it to Provider.
        // Otherwise, if we don't have URL yet - then we should skip introspection query (which will
        // return an error otherwise) by setting schema to `null` explicitly.
        // if the url is provided - then we set `schema: undefined` and graphiql will make
        // introspection query automatically and load the schema. we should aim to provide schema manually via our server action in future
        schema={customSchema ? customSchema : url === defaultFormUIState.url ? null : undefined}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
            <TextField
              id='standard-basic'
              sx={{ flexGrow: 4 }}
              value={urlTextFieldValue}
              onChange={handleURLTextFieldChange}
              label={t('urlLabel')}
              error={!!urlTextFieldError}
              helperText={urlTextFieldError}
              onBlur={handleURLTextFieldBlur}
              required
            />
            <TextField
              select
              size='medium'
              sx={{ flexGrow: 1 }}
              label={t('queryExample')}
              value={selectedExampleQueryName}
              onChange={handleExampleQueryChange}
            >
              <MenuItem value={exampleQueries[0]}>{exampleQueries[0]}</MenuItem>
              <MenuItem value={exampleQueries[1]}>{exampleQueries[1]}</MenuItem>
              <MenuItem value={exampleQueries[2]}>{exampleQueries[2]}</MenuItem>
            </TextField>
            <Button
              variant='contained'
              disabled={isFetching || !!urlTextFieldError}
              sx={{ flexGrow: 0, alignSelf: 'stretch', maxHeight: '3.5rem' }}
              type='submit'
            >
              {t('runButton')}
            </Button>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label='basic tabs example'>
              <Tab label={t('queryTab')} />
              <Tab label={t('headersTab')} />
              <Tab label={t('variablesTab')} />
              <Tab label={t('documentationTab')} />
            </Tabs>
          </Box>

          <Box className={styles.tabWrapWindow}>
            <Box className={styles.tabWrap} style={{ transform: `translateX(${-tabIndex * 25}%)` }}>
              <Box sx={{ width: '25%', maxHeight: '400px' }} className='graphiql-container'>
                <RDTGraphiQLRequestEditor
                  onQueryEdit={onQueryEdit}
                  onQueryVariablesEdit={onQueryVariablesEdit}
                  onBlur={handleRequestEditorBlur}
                ></RDTGraphiQLRequestEditor>
              </Box>

              <Box sx={{ width: '25%', maxHeight: '400px' }}>
                <KeyValueForm
                  onPairsChange={handlePairsChangeHeader}
                  title={t('headersTab')}
                  initPairs={requestHeaders}
                  height='none'
                />
              </Box>

              <Box sx={{ width: '25%', maxHeight: '400px' }}>
                <KeyValueForm
                  onPairsChange={handlePairsChangeVar}
                  title={t('variablesTab')}
                  initPairs={keyValuePairsVar}
                  shouldSaveToLS={true}
                  height='none'
                />
              </Box>

              <Box sx={{ width: '25%', maxHeight: '400px', overflow: 'scroll' }}>
                <RDTGraphiQLDocExplorer
                  baseURL={url}
                  onCustomSchemaFetch={onCustomSchemaFetch}
                ></RDTGraphiQLDocExplorer>
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
