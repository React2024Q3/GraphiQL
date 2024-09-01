'use client';

import { FormEvent, useState } from 'react';

import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { KeyValuePair } from '@/types&interfaces/types';
import { Box, Button, FormControl, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';

import KeyValueForm from '../KeyValueForm';
import { Loader } from '../Loader';
import { Notification } from '../Notification';
import ResponseDisplay from '../ResponseDisplay';
import styles from './RestForm.module.css';

function RestForm() {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<unknown>(null);
  const [headers, setHeaders] = useState<string>('');
  const [keyValuePairsHeader, setKeyValuePairsHeader] = useState<KeyValuePair[]>([]);
  const [keyValuePairsVar, setKeyValuePairsVar] = useState<KeyValuePair[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { loading, error } = useAuthRedirect();

  if (loading) {
    return <Loader />;
  }

  const handlePairsChangeHeader = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsHeader(newPairs);
  };

  const handlePairsChangeVar = (newPairs: KeyValuePair[]) => {
    setKeyValuePairsVar(newPairs);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const currentKeyValuesHeader = keyValuePairsHeader.filter((el) => !el.editable);
    const currentKeyValuesVar = keyValuePairsVar.filter((el) => !el.editable);
    console.log(currentKeyValuesHeader);
    console.log(currentKeyValuesVar);

    const encodedUrl = encodeURIComponent(btoa(url));
    const encodedBody = body && method !== 'GET' ? encodeURIComponent(btoa(body)) : '';
    // setKeyValuePairsHeader([]);
    try {
      let apiUrl = `http://localhost:3000/api/${method}/${encodedUrl}${
        encodedBody ? `/${encodedBody}` : ''
      }`;

      if (currentKeyValuesHeader.length)
        apiUrl += '?' + currentKeyValuesHeader.map(({ key, value }) => key + '=' + value).join('&');
      console.log('apiUrl: ' + apiUrl);

      const res = await fetch(apiUrl);

      const data = await res.json();
      setResponse(data.data);
      setHeaders(JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    } catch (error) {
      console.error('Request error.', error);
      setResponse({ error: 'Request error.' });
    }
  };

  return (
    <>
      {error && <Notification isOpen={!!error} message={error.message} severity='error' />}
      <form onSubmit={handleSubmit}>
        <div className={styles.urlWrap}>
          <FormControl size='small'>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
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
              required
            />
          </FormControl>

          <Button variant='contained' type='submit'>
            Send
          </Button>
        </div>

        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <div>
            <label>
              Request body (JSON):
              <textarea value={body} onChange={(e) => setBody(e.target.value)} />
            </label>
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
            <KeyValueForm onPairsChange={handlePairsChangeHeader} title={'Headers'} />

            <KeyValueForm onPairsChange={handlePairsChangeVar} title={'Variables'} />
          </Box>
        </Box>
      </form>

      <ResponseDisplay headers={headers} response={JSON.stringify(response, null, 2)} />
    </>
  );
}

export default RestForm;
