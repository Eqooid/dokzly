export async function DELETE(request: Request) {
  const { storageId } = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/delete-store/${storageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { name } = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/update-store-name/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}