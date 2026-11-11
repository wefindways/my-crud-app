import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const ALLOWABLE_STATUS = ["pending", "in_progress", "completed"] as const;
type Status = (typeof ALLOWABLE_STATUS)[number];

const createItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// GET /api/items?status=pending
export async function GET(request: Request) {
  // 1. Input
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");

  // 2. Validate
  if (
    statusParam &&
    !ALLOWABLE_STATUS.includes(statusParam as Status)
  ) {
    return NextResponse.json(
      { error: "Invalid status filter" },
      { status: 400 },
    );
  }

  // 3. Query
  const records = statusParam
    ? await db
        .select()
        .from(items)
        .where(eq(items.status, statusParam as Status))
        .orderBy(desc(items.createdAt))
    : await db.select().from(items).orderBy(desc(items.createdAt));

  // 4. Respond
  return NextResponse.json(records, { status: 200 });
}

// POST /api/items
export async function POST(request: Request) {
  try {
    // 1. Input
    const body = await request.json();

    // 2. Validate
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }

    // 3. Query
    const [newItem] = await db.insert(items).values(parsed.data).returning();

    // 4. Respond
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
