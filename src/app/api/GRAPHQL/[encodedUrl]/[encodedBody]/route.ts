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
  const headersString = req.url.split('?')[1];
  console.log(headersString);
  try {
    const myRequest = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
