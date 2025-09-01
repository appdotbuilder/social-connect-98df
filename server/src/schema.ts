import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  profile_picture_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Public user schema (without sensitive data)
export const publicUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  profile_picture_url: z.string().nullable(),
  created_at: z.coerce.date()
});

export type PublicUser = z.infer<typeof publicUserSchema>;

// User input schemas
export const signUpInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100)
});

export type SignUpInput = z.infer<typeof signUpInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const updateProfileInputSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  profile_picture_url: z.string().nullable().optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

// Post schemas
export const postSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  content: z.string(),
  image_url: z.string().nullable(),
  video_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Post = z.infer<typeof postSchema>;

// Post with user info
export const postWithUserSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  content: z.string(),
  image_url: z.string().nullable(),
  video_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  user: publicUserSchema,
  likes_count: z.number(),
  comments_count: z.number(),
  is_liked_by_user: z.boolean().optional()
});

export type PostWithUser = z.infer<typeof postWithUserSchema>;

export const createPostInputSchema = z.object({
  user_id: z.number(),
  content: z.string().min(1).max(2000),
  image_url: z.string().nullable().optional(),
  video_url: z.string().nullable().optional()
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

// Friendship schemas
export const friendshipStatusEnum = z.enum(['pending', 'accepted', 'declined']);
export type FriendshipStatus = z.infer<typeof friendshipStatusEnum>;

export const friendshipSchema = z.object({
  id: z.number(),
  requester_id: z.number(),
  addressee_id: z.number(),
  status: friendshipStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Friendship = z.infer<typeof friendshipSchema>;

export const sendFriendRequestInputSchema = z.object({
  requester_id: z.number(),
  addressee_id: z.number()
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestInputSchema>;

export const respondToFriendRequestInputSchema = z.object({
  friendship_id: z.number(),
  response: z.enum(['accept', 'decline'])
});

export type RespondToFriendRequestInput = z.infer<typeof respondToFriendRequestInputSchema>;

// Like schemas
export const likeSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  created_at: z.coerce.date()
});

export type Like = z.infer<typeof likeSchema>;

export const toggleLikeInputSchema = z.object({
  user_id: z.number(),
  post_id: z.number()
});

export type ToggleLikeInput = z.infer<typeof toggleLikeInputSchema>;

// Comment schemas
export const commentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  content: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Comment = z.infer<typeof commentSchema>;

export const commentWithUserSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  content: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  user: publicUserSchema
});

export type CommentWithUser = z.infer<typeof commentWithUserSchema>;

export const createCommentInputSchema = z.object({
  user_id: z.number(),
  post_id: z.number(),
  content: z.string().min(1).max(1000)
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Feed input schema
export const getFeedInputSchema = z.object({
  user_id: z.number(),
  limit: z.number().int().positive().optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type GetFeedInput = z.infer<typeof getFeedInputSchema>;

// Get user posts input schema
export const getUserPostsInputSchema = z.object({
  user_id: z.number(),
  viewer_user_id: z.number().optional(),
  limit: z.number().int().positive().optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type GetUserPostsInput = z.infer<typeof getUserPostsInputSchema>;

// Get comments input schema
export const getCommentsInputSchema = z.object({
  post_id: z.number(),
  limit: z.number().int().positive().optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type GetCommentsInput = z.infer<typeof getCommentsInputSchema>;