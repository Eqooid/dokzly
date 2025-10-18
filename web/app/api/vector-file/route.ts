import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get('storeId');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/vector-files/${storeId}`);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function DELETE(request: NextRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/delete-file`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: request.body,
    duplex: 'half'
  } as any);

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}