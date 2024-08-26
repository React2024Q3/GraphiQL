'use client';

import { useState, FormEvent } from 'react';
import ResponseDisplay from '../ResponseDisplay';
// import fetchRequestRest from '@/service/restApi';

// type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default function RestForm() {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<unknown>(null);
  const [headers, setHeaders] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const encodedUrl = btoa(url);
    const encodedBody = body ? btoa(body) : '';

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
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Метод:
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            URL:
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
          </label>
        </div>

        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <div>
            <label>
              Тело запроса (JSON):
              <textarea value={body} onChange={(e) => setBody(e.target.value)} />
            </label>
          </div>
        )}

        <button type="submit">Send request</button>
      </form>

      <ResponseDisplay headers={headers} response={JSON.stringify(response, null, 2)} />
    </div>
  );
}
