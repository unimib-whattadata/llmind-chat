import { chat, user } from "~/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  createChat: publicProcedure
    .input(
      z.object({
        userToken: z.number(),
        chatName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newChat = await ctx.db
        .insert(chat)
        .values({
          chatName: input.chatName,
          userId: input.userToken,
        })
        .returning();
      const createdChat = newChat[0];
      if (createdChat) return createdChat;
      throw Error("Error on creating Chat");
    }),
  getChats: publicProcedure
    .input(
      z.object({
        userToken: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chat.findMany({
        where: eq(chat.userId, input.userToken),
      });
    }),
});
