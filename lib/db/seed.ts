import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { items } from "./schema.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  const existingItems = await db.select().from(items);
  if (existingItems.length === 0) {
    await db.insert(items).values([
      {
        title: "Set up PostgreSQL & Drizzle ORM",
        description: "Configure local database pool, schema, and Drizzle Studio.",
        status: "completed",
        priority: "high",
      },
      {
        title: "Build GitHub Actions CI pipeline",
        description: "Automate TypeScript, ESLint, Drizzle schema push, and Next.js build checks.",
        status: "completed",
        priority: "high",
      },
      {
        title: "Create CRUD API Route Handlers",
        description: "Implement GET, POST, PATCH, and DELETE endpoints with Zod validation.",
        status: "in_progress",
        priority: "high",
      },
      {
        title: "Migrate Database to Supabase",
        description: "Switch DATABASE_URL to Supabase cloud Postgres for production deployment.",
        status: "pending",
        priority: "medium",
      },
    ]);
    console.log("Seeded items table.");
  }

  await pool.end();
  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
