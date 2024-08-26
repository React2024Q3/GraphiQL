import { NextRequest, NextResponse } from 'next/server';

const decodeBase64 = (input: string): string => {
  return Buffer.from(input, 'base64').toString('utf-8');
};

export async function GET(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string } }
) {
  return handleRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string } }
) {
  return handleRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string } }
) {
  return handleRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string } }
) {
  return handleRequest(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { method: string; encodedUrl: string } }
) {
  return handleRequest(req, params);
}

async function handleRequest(req: NextRequest, params: { method: string; encodedUrl: string }) {
  const { method, encodedUrl } = params;

  const url = decodeBase64(encodedUrl);

  const encodedBody = req.nextUrl.searchParams.get('body');
  const body = encodedBody ? JSON.parse(decodeBase64(encodedBody)) : undefined;

  const headers: HeadersInit = {};
  req.headers.forEach((value, key) => {
    if (key !== 'host' && key !== 'connection') {
      headers[key] = value;
    }
  });

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
