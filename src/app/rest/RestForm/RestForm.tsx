import { useState, FormEvent, ChangeEvent } from 'react';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ResponseData {
  data?: unknown;
  error?: string;
}

export default function RestForm({
  onSubmit,
}: {
  onSubmit: (e: FormEvent) => void;
}) {
  const [url, setUrl] = useState<string>('');
  const [method, setMethod] = useState<HTTPMethod>('GET');
  const [headers, setHeaders] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<ResponseData | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e);

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          url,
          headers: headers ? JSON.parse(headers) : {},
          body: body ? JSON.parse(body) : null,
        }),
      });

      const data: ResponseData = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Response error' });
      console.error(error);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={handleInputChange(setUrl)}
            required
          />
        </div>
        <div>
          <label>Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HTTPMethod)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label>Headers (JSON):</label>
          <textarea value={headers} onChange={handleInputChange(setHeaders)} />
        </div>
        <div>
          <label>Body (JSON):</label>
          <textarea value={body} onChange={handleInputChange(setBody)} />
        </div>
        <button type="submit">Send Request</button>
      </form>

      <div>
        <h2>Response:</h2>
        <pre>
          {response ? JSON.stringify(response, null, 2) : 'No response'}
        </pre>
      </div>
    </>
  );
}
