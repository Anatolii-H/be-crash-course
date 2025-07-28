import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  boolean,
  varchar,
  uniqueIndex,
  jsonb
} from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export const postsToTags = pgTable(
  'posts_to_tags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' })
  },
  (table) => {
    return [uniqueIndex('post_tag_unique').on(table.postId, table.tagId)];
  }
);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    authorId: uuid('author_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
  },
  (post) => [index('created_at_index').on(post.createdAt)]
);

// index('profiles_email_trgm_idx').using('gin', sql`${table.email} gin_trgm_ops`)

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    sub: text('sub').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    role: text('role').default('user').notNull(),
    isPending: boolean('is_pending').default(false).notNull(),
    isDisabled: boolean('is_disabled').default(false).notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
  },

  (user) => [
    index('user_first_name_trgm_index').using('gin', sql`${user.firstName} gin_trgm_ops`),
    index('user_last_name_trgm_index').using('gin', sql`${user.lastName} gin_trgm_ops`),
    index('user_email_trgm_index').using('gin', sql`${user.email} gin_trgm_ops`)
  ]
);

export const archive = pgTable('archive', {
  id: uuid('id').defaultRandom().primaryKey(),
  archivedAt: timestamp('archived_at').defaultNow().notNull(),
  entityType: varchar({ length: 50 }).notNull(),
  entityId: uuid().notNull().unique(),
  data: jsonb('data').notNull()
});
