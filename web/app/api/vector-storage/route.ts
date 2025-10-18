export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/vector-stores`);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(request: Request) {
  const requestData = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/create-store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });
  
  const data = await response.json(); 
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}