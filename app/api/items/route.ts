import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const statusFilterSchema = z.enum(['pending', 'in_progress', 'completed']).nullable();

const createItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// GET /api/items?status=pending
export async function GET(request: Request) {
  try {
    // 1. Input
    const { searchParams } = new URL(request.url);

    // 2. Validate
    const statusParam = statusFilterSchema.parse(searchParams.get('status'));

    // 3. Query
    const records = statusParam
      ? await db.select().from(items).where(eq(items.status, statusParam)).orderBy(desc(items.createdAt))
      : await db.select().from(items).orderBy(desc(items.createdAt));

    // 4. Respond
    return NextResponse.json(records, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: z.flattenError(error) }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/items
export async function POST(request: Request) {
  try {
    // 1. Input
    const body = await request.json();

    // 2. Validate
    const validated = createItemSchema.parse(body);

    // 3. Query
    const [newItem] = await db
      .insert(items)
      .values(validated)
      .returning();

    // 4. Respond
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: z.flattenError(error) }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
