import { createTRPCRouter } from "~/server/api/trpc";
import { checkoutRouter } from "~/server/api/routers/checkout";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  checkout: checkoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
