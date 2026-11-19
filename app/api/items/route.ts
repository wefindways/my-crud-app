import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

const ALLOWABLE_STATUS = ["pending", "in_progress", "completed"] as const;
type Status = (typeof ALLOWABLE_STATUS)[number];
const PAGE_SIZE = 10;

const createItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});

// GET /api/items?status=pending&page=1
export async function GET(request: Request) {
  // 1. Input
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page")) || 1); // missing/invalid → 1

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

  // Both queries use the same filter, so the count always matches the list
  const filter = statusParam ? eq(items.status, statusParam as Status) : undefined;

  // 3. Query: run both at the same time
  const [records, countRows] = await Promise.all([
    db
      .select()
      .from(items)
      .where(filter)
      .orderBy(desc(items.createdAt), desc(items.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE), // page 1 skips 0, page 2 skips 10...
    db.select({ total: count() }).from(items).where(filter),
  ]);

  const total = countRows[0].total;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 4. Respond
  return NextResponse.json({ items: records, total, totalPages }, { status: 200 });
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
