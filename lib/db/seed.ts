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
    },
    {
      title: "Submit laboratory exercises on friday",
      description: "Finalize before the deadline",
      status: "in_progress",
    },
    {
      title: "Review Operating Systems Chapter 4",
      description: "Study synchronization notes and practice semaphores.",
      status: "pending",
    },
    {
      title: "Weekend grocery run",
      description: "Restock oats, milk, eggs, and coffee beans.",
      status: "pending",
    },
    {
      title: "Fold and store laundry",
      description: "Sort shirts, bedsheets, and towels.",
      status: "completed",
    },
    {
      title: "Finish database normalization worksheet",
      description: "Cover 1NF to 3NF with the sample tables",
      status: "completed",
    },
    {
      title: "Write README for the takehome project",
      description: "Setup steps, stack choices, and trade-offs",
      status: "pending",
    },
    {
      title: "Deploy app to Vercel",
      description: "Connect the hosted database and test the live link",
      status: "pending",
    },
    {
      title: "Group meeting for capstone",
      description: "Discuss the remaining modules and assign tasks",
      status: "pending",
    },
    {
      title: "Update portfolio website",
      description: "Add the new project and refresh the screenshots",
      status: "in_progress",
    },
    { title: "Pay internet bill", status: "completed" },
    {
      title: "Pay water bill",
      status: "completed",
    },
    { title: "Clean up unused components", status: "pending" },
  ]);

  await pool.end();
  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
