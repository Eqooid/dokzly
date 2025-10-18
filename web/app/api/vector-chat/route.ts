import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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