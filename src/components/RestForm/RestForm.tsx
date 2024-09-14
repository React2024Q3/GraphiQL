'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
import useVariablesLS from '@/shared/hooks/useVariablesLS';
import { Methods } from '@/types&interfaces/enums';
import { ApiResponse } from '@/types&interfaces/interfaces';
import { KeyValuePair, MethodType } from '@/types&interfaces/types';
import changeUrlClient from '@/utils/changeUrlClient';
import switchTextJsonHeader from '@/utils/switchTextJsonHeader';
import transformVariables from '@/utils/transformVariables';
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import ErrorsNotificationsRestClient from '../ErrorsNotificationsRestClient';
import KeyValueForm from '../KeyValueForm';
import { Loader } from '../Loader';
import ResponseDisplay from '../ResponseDisplay';
import CodeEditor from './CodeEditor';
import styles from './RestForm.module.css';

function RestForm({ initMethod, path }: { initMethod: MethodType; path: string[] }) {
  const [method, setMethod] = useState<MethodType>(initMethod);
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isJsonMode, setIsJsonMode] = useState<boolean>(true);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [headers, setHeaders] = useState<string>('');
  const [statusCode, setStatusCode] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('');
  const [keyValuePairsHeader, setKeyValuePairsHeader] = useState<KeyValuePair[]>([]);
  const [keyValuePairsVar, setKeyValuePairsVar] = useState<KeyValuePair[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { loading, error } = useAuthRedirect();
  const [parseError, setParseError] = useState<string | null>(null);
  const [_, saveUrlToLS] = useHistoryLS();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const [vars] = useVariablesLS();
  const t = useTranslations();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        if (path && path.length) {
          const decodedUrl = atob(decodeURIComponent(path[0]));
          setUrl(decodedUrl);
        }

        if (path && path.length > 1) {
          const decodedBody = atob(decodeURIComponent(path[1]));
          setBody(decodedBody);
        }
      } catch (error) {
        console.warn(error);
        setParseError(t('errors.decode'));
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
  }, [path, searchParams, t]);

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

      setStatusCode(res.status.toString());
      setStatusText(res.statusText);

      const contentType = res.headers.get('content-type');

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { error: await res.text() };
      }

      setResponse(data);
      setHeaders(JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    } catch (error) {
      console.error('Request error:', error);
      setResponse({ error: t('errors.request-error') });
    }
  };

  const onChangeMethod = (e: SelectChangeEvent<MethodType>) => {
    const val = e.target.value as MethodType;
    setMethod(val);
    if (val === Methods.POST || val === Methods.PATCH || val === Methods.PUT) {
      const newHeaders = switchTextJsonHeader(isJsonMode, keyValuePairsHeader);
      setKeyValuePairsHeader(newHeaders);
      changeUrlClient(e.target.value as MethodType, url, body, newHeaders);
    } else {
      changeUrlClient(e.target.value as MethodType, url, body, keyValuePairsHeader);
    }
  };

  const toggleMode = () => {
    const newHeaders = switchTextJsonHeader(!isJsonMode, keyValuePairsHeader);
    setKeyValuePairsHeader(newHeaders);
    changeUrlClient(method, url, body, newHeaders);
    setIsJsonMode(!isJsonMode);
  };

  return (
    <Container className={styles.formContainer}>
      <ErrorsNotificationsRestClient parseError={parseError} error={error} response={response} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.urlWrap}>
          <FormControl size='small'>
            <Select value={method} onChange={onChangeMethod}>
              <MenuItem className={styles.selectItem} value={Methods.GET}>
                {Methods.GET}
              </MenuItem>
              <MenuItem className={styles.selectItem} value={Methods.POST}>
                {Methods.POST}
              </MenuItem>
              <MenuItem className={styles.selectItem} value={Methods.PUT}>
                {Methods.PUT}
              </MenuItem>
              <MenuItem className={styles.selectItem} value={Methods.DELETE}>
                {Methods.DELETE}
              </MenuItem>
              <MenuItem className={styles.selectItem} value={Methods.PATCH}>
                {Methods.PATCH}
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
            {t('buttons.send')}
          </Button>
        </div>

        {(method === Methods.POST || method === Methods.PUT || method === Methods.PATCH) && (
          <div>
            <Button variant='contained' onClick={toggleMode}>
              {isJsonMode ? t('buttons.to-text') : t('buttons.to-json')}
            </Button>
            <CodeEditor value={body} onChange={setBody} isJsonMode={isJsonMode} />
          </div>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label='basic tabs example'>
            <Tab label={t('client.headers')} />
            <Tab label={t('client.variables')} />
          </Tabs>
        </Box>
        <Box className={styles.keyValFormWrapWindow}>
          <Box
            className={styles.keyValFormWrap}
            style={{ transform: `translateX(${-tabIndex * 50}%)` }}
          >
            <KeyValueForm
              onPairsChange={handlePairsChangeHeader}
              title={t('client.headers')}
              initPairs={keyValuePairsHeader}
              height={tabIndex === -1 ? '0' : 'none'}
            />

            <KeyValueForm
              onPairsChange={handlePairsChangeVar}
              title={t('client.variables')}
              initPairs={keyValuePairsVar}
              isVars={true}
              height={tabIndex === 0 ? '0' : 'none'}
            />
          </Box>
        </Box>
      </form>

      {response ? (
        <ResponseDisplay
          statusCode={statusCode}
          statusText={statusText}
          headers={headers}
          response={response}
        />
      ) : null}
    </Container>
  );
}

export default RestForm;
