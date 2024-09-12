'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import useVariablesLS from '@/shared/hooks/useVariablesLS';
import { Methods } from '@/types&interfaces/enums';
import { KeyValuePair, MethodType } from '@/types&interfaces/types';
import changeUrlClient from '@/utils/changeUrlClient';
import transformVariables from '@/utils/transformVariables';
import { Box, Button, Container, FormControl, MenuItem, Select, SelectChangeEvent, Tab, Tabs, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import { ErrorNotification } from '../ErrorNotification';
import KeyValueForm from '../KeyValueForm';
import { Loader } from '../Loader';
import ResponseDisplay from '../ResponseDisplay';
import styles from './RestForm.module.css';
import CodeEditor from './CodeEditor'; // Импортируем новый компонент

interface ApiResponse {
  data?: unknown;
  error?: string;
}

function RestForm({ initMethod, path }: { initMethod: MethodType; path: string[] }) {
  const [method, setMethod] = useState<MethodType>(initMethod);
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isJsonMode, setIsJsonMode] = useState<boolean>(true); // New state for toggling between JSON and text modes
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [headers, setHeaders] = useState<string>('');
  const [keyValuePairsHeader, setKeyValuePairsHeader] = useState<KeyValuePair[]>([]);
  const [keyValuePairsVar, setKeyValuePairsVar] = useState<KeyValuePair[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { loading, error } = useAuthRedirect();
  const [_, saveUrlToLS] = useHistoryLS();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const [vars] = useVariablesLS();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (path && path.length) {
        const decodedUrl = atob(decodeURIComponent(path[0]));
        setUrl(decodedUrl);
      }

      if (path && path.length > 1) {
        const decodedBody = atob(decodeURIComponent(path[1]));
        setBody(decodedBody);
      }

      const searchParamsArray = Array.from(searchParams.entries());

      if (searchParamsArray.length > 0) {
        const parsedHeaders: KeyValuePair[] = searchParamsArray.map(([key, value]) => ({
          key,
          value,
          editable: false,
        }));
        setKeyValuePairsHeader(parsedHeaders);
      }
    }
  }, [path, searchParams]);

  useEffect(() => {
    setKeyValuePairsVar(vars.map(({ key, value }) => ({ key, value, editable: false })));
  }, [vars]);

  if (loading) {
    return <Loader />;
  }

  const handlePairsChangeHeader = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsHeader(newPairs);
    changeUrlClient(method, url, body, newPairs);
  };

  const handlePairsChangeVar = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsVar(newPairs);
    changeUrlClient(
      method,
      transformVariables(url, keyValuePairsVar),
      transformVariables(body, keyValuePairsVar),
      newPairs
    );
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = changeUrlClient(
        method,
        transformVariables(url, keyValuePairsVar),
        transformVariables(body, keyValuePairsVar),
        keyValuePairsHeader
      );

      saveUrlToLS(apiUrl);

      const res = await fetch('/api/' + apiUrl);
      if (res.status === 500) throw new Error('Server error');

      const data = await res.json();

      setResponse(data.data);
      setHeaders(JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    } catch (error) {
      console.error('Request error:', error);
      setResponse({ error: 'Request error.' });
    }
  };

  const onChangeMethod = (e: SelectChangeEvent<MethodType>) => {
    setMethod(e.target.value as MethodType);
    changeUrlClient(e.target.value as MethodType, url, body, keyValuePairsHeader);
  };

  const toggleMode = () => {
    setIsJsonMode(!isJsonMode); // Toggle between JSON and text modes
  };

  return (
    <Container className={styles.formContainer}>
      <ErrorNotification error={error} />
      <ErrorNotification error={response?.error} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.urlWrap}>
          <FormControl size='small'>
            <Select value={method} onChange={onChangeMethod}>
              <MenuItem className={styles.selectItem} value='GET'>
                GET
              </MenuItem>
              <MenuItem className={styles.selectItem} value='POST'>
                POST
              </MenuItem>
              <MenuItem className={styles.selectItem} value='PUT'>
                PUT
              </MenuItem>
              <MenuItem className={styles.selectItem} value='DELETE'>
                DELETE
              </MenuItem>
              <MenuItem className={styles.selectItem} value='PATCH'>
                PATCH
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' className={styles.urlInput}>
            <TextField
              sx={{ p: 0 }}
              label='URL'
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() =>
                changeUrlClient(
                  method,
                  transformVariables(url, keyValuePairsVar),
                  transformVariables(body, keyValuePairsVar),
                  keyValuePairsHeader
                )
              }
              required
            />
          </FormControl>

          <Button variant='contained' type='submit'>
            Send
          </Button>
        </div>

        {(method === Methods.POST || method === Methods.PUT || method === Methods.PATCH) && (
          <div>
            <Button variant='contained' onClick={toggleMode}>
              {isJsonMode ? 'Switch to Text' : 'Switch to JSON'}
            </Button>
            <CodeEditor value={body} onChange={setBody} isJsonMode={isJsonMode} />
          </div>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label='basic tabs example'>
            <Tab label='Headers' />
            <Tab label='Variables' />
          </Tabs>
        </Box>
        <Box className={styles.keyValFormWrapWindow}>
          <Box
            className={styles.keyValFormWrap}
            style={{ transform: `translateX(${-tabIndex * 50}%)` }}
          >
            <KeyValueForm
              onPairsChange={handlePairsChangeHeader}
              title={'Headers'}
              initPairs={keyValuePairsHeader}
              height = {tabIndex === -1 ? '0' : 'none'}
            />

            <KeyValueForm
              onPairsChange={handlePairsChangeVar}
              title={'Variables'}
              initPairs={keyValuePairsVar}
              isVars={true}
              height = {tabIndex === 0 ? '0' : 'none'}
            />
          </Box>
        </Box>
      </form>

      <ResponseDisplay headers={headers} response={JSON.stringify(response, null, 2)} />
    </Container>
  );
}

export default RestForm;
