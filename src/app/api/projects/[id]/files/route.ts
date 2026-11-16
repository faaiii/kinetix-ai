import { NextResponse } from 'next/server';
import { getUserSession, canAccessProject } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/pdf',
  'application/javascript',
  'text/javascript',
  'text/typescript',
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession(req);
    const { id: projectId } = await params;

    const allowed = await canAccessProject(session.userId, projectId);
    if (!allowed) {
      return NextResponse.json({ error: 'Unauthorized to upload to this project' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum 10MB limit' }, { status: 400 });
    }

    // Basic heuristic: 1 token ≈ 4 characters
    const estimatedTokens = Math.ceil(file.size / 4);

    const uploadedFileRecord = {
      id: `file-${Date.now()}`,
      projectId,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type || 'text/plain',
      tokenCount: estimatedTokens,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ file: uploadedFileRecord }, { status: 201 });
  } catch (err: any) {
    console.error('File Upload Error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}
