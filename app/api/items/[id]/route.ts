import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.string().uuid("Invalid Item ID format");

const updateItemSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["pending", "in_progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/items/:id
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    // 1. Input
    const { id } = await params;

    // 2. Validate ID
    const idCheck = idSchema.safeParse(id);
    if (!idCheck.success) {
      return NextResponse.json({ error: "Invalid Item ID" }, { status: 400 });
    }

    const body = await request.json();

    // 2. Validate Body
    const parsedBody = updateItemSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { errors: z.flattenError(parsedBody.error) },
        { status: 400 },
      );
    }

    // 3. Query
    const [updatedItem] = await db
      .update(items)
      .set({ ...parsedBody.data, updatedAt: new Date() })
      .where(eq(items.id, idCheck.data))
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 4. Respond
    return NextResponse.json(updatedItem, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/items/:id
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    // 1. Input
    const { id } = await params;

    // 2. Validate (URL UUID)
    const idCheck = idSchema.safeParse(id);
    if (!idCheck.success) {
      return NextResponse.json({ error: "Invalid Item ID" }, { status: 400 });
    }

    // 3. Query
    const [deletedItem] = await db
      .delete(items)
      .where(eq(items.id, idCheck.data))
      .returning();

    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 4. Respond
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
