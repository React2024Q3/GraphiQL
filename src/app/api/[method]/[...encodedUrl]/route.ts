import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string[] } }
) {
  return handleRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string[] } }
) {
  return handleRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string[] } }
) {
  return handleRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string[] } }
) {
  return handleRequest(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string[] } }
) {
  return handleRequest(req, params);
}

async function handleRequest(req: NextRequest, params: { method: string; encodedUrl: string[] }) {
  const { method, encodedUrl } = params;

  const url = atob(decodeURIComponent(encodedUrl[0]));
  console.log(encodedUrl);
  

  const body = encodedUrl[1] ? JSON.parse(atob(decodeURIComponent(encodedUrl[1]))) : undefined;

  const queryString = req.url.split('?')[1];
  const headers: HeadersInit = {};
  let arrayOfPairs: Array<[string, string]> = [];
  if (queryString) {
    const searchParams = new URLSearchParams(decodeURIComponent(queryString));
    arrayOfPairs = Array.from(searchParams.entries());
  }

  arrayOfPairs.forEach((pair) => {
    headers[pair[0].toString()] = pair[1].toString();
  });
  console.log(headers);
console.log(url);

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
     

    return NextResponse.json({ data, headers: response.headers }, { status: response.status });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Request response' }, { status: 500 });
  }
}
