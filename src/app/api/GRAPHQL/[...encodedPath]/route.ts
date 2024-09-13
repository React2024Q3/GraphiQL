import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { encodedPath: string[] } }) {
  return handleRequest(req, params);
}

async function handleRequest(req: NextRequest, params: { encodedPath: string[] }) {
  const { encodedPath } = params;
  try {
    const url = atob(decodeURIComponent(encodedPath[0]));
    const body = atob(decodeURIComponent(encodedPath[1]));
    const headersString = decodeURIComponent(req.url.split('?')[1]);
    const headers: HeadersInit = {};
    if (headersString) {
      const headerPairs = headersString.split('&');
      for (const pair of headerPairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
          headers[key] = value;
        }
      }
    }
    //console.log(`headers: ${JSON.stringify(headers)}`);

    try {
      const myRequest = new Request(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const response = await fetch(myRequest);

      let data = '{data: noData}';
      data = await response.json();
      // console.log(response.status);
      // console.log(data);

      const nextResponse = NextResponse.json(
        { data, headers: response.headers },
        { status: response.status }
      );
      return nextResponse;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'API server network/cors response error' },
        { status: 500 }
      );
    }
  } catch {
    //console.error(e);
    return NextResponse.json(
      { error: 'Request parameters error. Please check your URL' },
      { status: 500 }
    );
  }
}
