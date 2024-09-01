'use client';

import { FormEvent, useState } from 'react';

import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

import { ErrorNotification } from '../ErrorNotification';
import { Loader } from '../Loader';
import ResponseDisplay from '../ResponseDisplay';

function RestForm() {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<unknown>(null);
  const [headers, setHeaders] = useState<string>('');
  const { loading, error } = useAuthRedirect();

  if (loading) {
    return <Loader />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const encodedUrl = encodeURIComponent(btoa(url));
    const encodedBody = body && method !== 'GET' ? encodeURIComponent(btoa(body)) : '';

    try {
      const apiUrl = `http://localhost:3000/api/${method}/${encodedUrl}${
        encodedBody ? `?body=${encodedBody}` : ''
      }`;

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
    <div>
      <ErrorNotification error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Method:
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value='GET'>GET</option>
              <option value='POST'>POST</option>
              <option value='PUT'>PUT</option>
              <option value='DELETE'>DELETE</option>
              <option value='PATCH'>PATCH</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            URL:
            <input type='text' value={url} onChange={(e) => setUrl(e.target.value)} required />
          </label>
        </div>

        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <div>
            <label>
              Request body (JSON):
              <textarea value={body} onChange={(e) => setBody(e.target.value)} />
            </label>
          </div>
        )}

        <button type='submit'>Send request</button>
      </form>

      <ResponseDisplay headers={headers} response={JSON.stringify(response, null, 2)} />
    </div>
  );
}

export default RestForm;
