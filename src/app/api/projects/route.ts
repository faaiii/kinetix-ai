import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserSession } from '@/lib/auth';
import { INITIAL_PROJECTS } from '@/lib/mock-data';

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  customInstructions: z.string().max(5000).optional(),
});

export async function GET(req: Request) {
  try {
    await getUserSession(req);
    return NextResponse.json({ projects: INITIAL_PROJECTS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getUserSession(req);
    const body = await req.json();
    const validated = createProjectSchema.parse(body);

    const newProject = {
      id: `proj-${Date.now()}`,
      title: validated.title,
      description: validated.description || '',
      customInstructions: validated.customInstructions || '',
      fileCount: 0,
      tokenCount: 0,
      created_by: session.userId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
