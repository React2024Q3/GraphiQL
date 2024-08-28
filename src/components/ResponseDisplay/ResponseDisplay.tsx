'use client';

interface ResponseDisplayProps {
  response: string;
  headers: string;
}

export default function ResponseDisplay({ response, headers }: ResponseDisplayProps) {
  return (
    <>
      <div>
        <h3>Response body:</h3>
        <pre>{response ? response : 'No response body'}</pre>
      </div>
      <div>
        <h3>Response header:</h3>
        <pre>{headers ? headers : 'No response header'}</pre>
      </div>
    </>
  );
}
