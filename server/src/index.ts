import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  signUpInputSchema,
  loginInputSchema,
  updateProfileInputSchema,
  createPostInputSchema,
  getUserPostsInputSchema,
  getFeedInputSchema,
  sendFriendRequestInputSchema,
  respondToFriendRequestInputSchema,
  toggleLikeInputSchema,
  createCommentInputSchema,
  getCommentsInputSchema
} from './schema';

// Import handlers
import { signUp } from './handlers/sign_up';
import { login } from './handlers/login';
import { getUserProfile } from './handlers/get_user_profile';
import { updateProfile } from './handlers/update_profile';
import { createPost } from './handlers/create_post';
import { getUserPosts } from './handlers/get_user_posts';
import { getFeed } from './handlers/get_feed';
import { sendFriendRequest } from './handlers/send_friend_request';
import { respondToFriendRequest } from './handlers/respond_to_friend_request';
import { getFriends } from './handlers/get_friends';
import { getPendingFriendRequests } from './handlers/get_pending_friend_requests';
import { toggleLike } from './handlers/toggle_like';
import { createComment } from './handlers/create_comment';
import { getComments } from './handlers/get_comments';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  signUp: publicProcedure
    .input(signUpInputSchema)
    .mutation(({ input }) => signUp(input)),
  
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  // User profile routes
  getUserProfile: publicProcedure
    .input(z.number())
    .query(({ input }) => getUserProfile(input)),

  updateProfile: publicProcedure
    .input(updateProfileInputSchema)
    .mutation(({ input }) => updateProfile(input)),

  // Post routes
  createPost: publicProcedure
    .input(createPostInputSchema)
    .mutation(({ input }) => createPost(input)),

  getUserPosts: publicProcedure
    .input(getUserPostsInputSchema)
    .query(({ input }) => getUserPosts(input)),

  getFeed: publicProcedure
    .input(getFeedInputSchema)
    .query(({ input }) => getFeed(input)),

  // Friendship routes
  sendFriendRequest: publicProcedure
    .input(sendFriendRequestInputSchema)
    .mutation(({ input }) => sendFriendRequest(input)),

  respondToFriendRequest: publicProcedure
    .input(respondToFriendRequestInputSchema)
    .mutation(({ input }) => respondToFriendRequest(input)),

  getFriends: publicProcedure
    .input(z.number())
    .query(({ input }) => getFriends(input)),

  getPendingFriendRequests: publicProcedure
    .input(z.number())
    .query(({ input }) => getPendingFriendRequests(input)),

  // Interaction routes
  toggleLike: publicProcedure
    .input(toggleLikeInputSchema)
    .mutation(({ input }) => toggleLike(input)),

  createComment: publicProcedure
    .input(createCommentInputSchema)
    .mutation(({ input }) => createComment(input)),

  getComments: publicProcedure
    .input(getCommentsInputSchema)
    .query(({ input }) => getComments(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();