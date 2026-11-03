import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const idSchema = z.uuid('Invalid item ID format');

const updateItemSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/items/:id
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    // 1. Input
    const { id } = await params;
    const body = await req.json();

    // 2. Validate (both URL UUID and JSON body)
    const validId = idSchema.parse(id);
    const validated = updateItemSchema.parse(body);

    // 3. Query
    const [updatedItem] = await db
      .update(items)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(items.id, validId))
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 4. Respond
    return NextResponse.json(updatedItem, { status: 200 });
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

// DELETE /api/items/:id
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    // 1. Input
    const { id } = await params;

    // 2. Validate (URL UUID)
    const validId = idSchema.parse(id);

    // 3. Query
    const [deletedItem] = await db
      .delete(items)
      .where(eq(items.id, validId))
      .returning();

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 4. Respond
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
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
