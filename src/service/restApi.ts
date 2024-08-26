interface ProxyRequest {
  method: string;
  url: string;
  headers?: HeadersInit;
  body?: unknown;
}

interface ProxyResponse {
  data?: unknown;
  error?: string;
}

export default async function fetchRequestRest(proxyRequest: ProxyRequest): Promise<ProxyResponse> {
  const { method, url, headers, body } = proxyRequest;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    let data: unknown;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: 'Occur request error' };
  }
}
