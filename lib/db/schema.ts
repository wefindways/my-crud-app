import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Create enums so status is locked down
export const itemStatusEnum = pgEnum('item_status', ['pending', 'in_progress', 'completed']);

export const items = pgTable('items', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 120 }).notNull(),
    description: text('description'),
    status: itemStatusEnum('status').default('pending').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer TypeScript types directly from the schema!
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;