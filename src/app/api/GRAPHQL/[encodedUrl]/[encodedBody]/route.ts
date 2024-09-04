import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { encodedUrl: string; encodedBody: string } }
) {
  console.log('POST');
  //return NextResponse.json({ data: 'Next.js' } );
  return handleRequest(req, params);
}

async function handleRequest(
  req: NextRequest,
  params: { encodedUrl: string; encodedBody: string }
) {
  const { encodedUrl, encodedBody } = params;

  const url = atob(decodeURIComponent(encodedUrl));

  const body = atob(decodeURIComponent(encodedBody));
  console.log(url);
  console.log(body);
  //const headers = req.headers;
  //console.log(headers);
  // const headers: HeadersInit = {};
  // req.headers.forEach((value, key) => {
  //   if (key !== 'host' && key !== 'connection') {
  //     headers[key] = value;
  //   }
  // });

  try {
    // const response = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: body,
    //   //cache: 'no-store',
    // });

    const myRequest = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    //console.log(myRequest);
    console.log(myRequest.body);

    const response = await fetch(myRequest);
  
    //console.log(response.headers);
    let data = '{data: noData}';
    if (response.status < 300) {
      data = await response.json();
      console.log(data);

      //console.log(JSON.parse(data).todos.data);
    } else {
      console.log(response.status);
    }
    // const contentType = response.headers.get('content-type');
    //const data;

    // if (contentType && contentType.includes('application/json')) {

    // } else {
    //   data = await response.text();
    // }
    const nextResponse = NextResponse.json({ data, headers: response.headers }, { status: response.status });
    console.log(nextResponse);
    return nextResponse;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Request response' }, { status: 500 });
  }
}
