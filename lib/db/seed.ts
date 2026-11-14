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

  await db.delete(items);

  await db.insert(items).values([
    {
      title: "Clean kitchen and wash dishes",
      description: "Wipe down counters and take out the trash.",
      status: "completed",
      priority: "medium",
    },
    {
      title: "Submit laboratory exercises on friday",
      description: "Finalize before the deadline",
      status: "in_progress",
      priority: "high",
    },
    {
      title: "Review Operating Systems Chapter 4",
      description: "Study synchronization notes and practice semaphores.",
      status: "pending",
      priority: "high",
    },
    {
      title: "Weekend grocery run",
      description: "Restock oats, milk, eggs, and coffee beans.",
      status: "pending",
      priority: "low",
    },
    {
      title: "Fold and store laundry",
      description: "Sort shirts, bedsheets, and towels.",
      status: "completed",
      priority: "low",
    },
  ]);

  await pool.end();
  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
