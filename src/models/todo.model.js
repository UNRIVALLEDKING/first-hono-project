import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user.model';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zod schemas for validation
export const TodoSelectSchema = createSelectSchema(todos);
export const TodoInsertSchema = createInsertSchema(todos, {
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});
