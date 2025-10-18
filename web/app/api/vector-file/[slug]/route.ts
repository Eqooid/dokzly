import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formData = await request.formData();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors/upload-file/${slug}`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
