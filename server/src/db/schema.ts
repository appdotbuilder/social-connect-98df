import { serial, text, pgTable, timestamp, integer, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define friendship status enum
export const friendshipStatusEnum = pgEnum('friendship_status', ['pending', 'accepted', 'declined']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull(),
  bio: text('bio'), // Nullable by default
  profile_picture_url: text('profile_picture_url'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Posts table
export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  image_url: text('image_url'), // Nullable by default
  video_url: text('video_url'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Friendships table
export const friendshipsTable = pgTable('friendships', {
  id: serial('id').primaryKey(),
  requester_id: integer('requester_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  addressee_id: integer('addressee_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  status: friendshipStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure unique friendship between two users (prevent duplicate requests)
  uniqueFriendship: unique().on(table.requester_id, table.addressee_id),
}));

// Likes table
export const likesTable = pgTable('likes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  post_id: integer('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure user can only like a post once
  uniqueLike: unique().on(table.user_id, table.post_id),
}));

// Comments table
export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  post_id: integer('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  likes: many(likesTable),
  comments: many(commentsTable),
  sentFriendRequests: many(friendshipsTable, { relationName: 'requester' }),
  receivedFriendRequests: many(friendshipsTable, { relationName: 'addressee' }),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.id],
  }),
  likes: many(likesTable),
  comments: many(commentsTable),
}));

export const friendshipsRelations = relations(friendshipsTable, ({ one }) => ({
  requester: one(usersTable, {
    fields: [friendshipsTable.requester_id],
    references: [usersTable.id],
    relationName: 'requester',
  }),
  addressee: one(usersTable, {
    fields: [friendshipsTable.addressee_id],
    references: [usersTable.id],
    relationName: 'addressee',
  }),
}));

export const likesRelations = relations(likesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [likesTable.user_id],
    references: [usersTable.id],
  }),
  post: one(postsTable, {
    fields: [likesTable.post_id],
    references: [postsTable.id],
  }),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [commentsTable.user_id],
    references: [usersTable.id],
  }),
  post: one(postsTable, {
    fields: [commentsTable.post_id],
    references: [postsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;
export type Friendship = typeof friendshipsTable.$inferSelect;
export type NewFriendship = typeof friendshipsTable.$inferInsert;
export type Like = typeof likesTable.$inferSelect;
export type NewLike = typeof likesTable.$inferInsert;
export type Comment = typeof commentsTable.$inferSelect;
export type NewComment = typeof commentsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  posts: postsTable,
  friendships: friendshipsTable,
  likes: likesTable,
  comments: commentsTable,
};