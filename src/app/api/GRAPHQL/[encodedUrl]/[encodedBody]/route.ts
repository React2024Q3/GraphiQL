import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { encodedUrl: string; encodedBody: string } }
) {
  return handleRequest(req, params);
}

async function handleRequest(
  req: NextRequest,
  params: { encodedUrl: string; encodedBody: string }
) {
  const { encodedUrl, encodedBody } = params;

  const url = atob(decodeURIComponent(encodedUrl));
  const body = atob(decodeURIComponent(encodedBody));
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
  // console.log(headers);
  try {
    const myRequest = new Request(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const response = await fetch(myRequest);

    let data = '{data: noData}';
    if (response.ok) {
      data = await response.json();
      //console.log(data);
    } else {
      console.log(response.status);
    }

    const nextResponse = NextResponse.json(
      { data, headers: response.headers },
      { status: response.status }
    );
    return nextResponse;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Request response' }, { status: 500 });
  }
}
