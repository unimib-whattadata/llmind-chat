import { chat, message } from "~/server/db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { env } from "~/env";

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
      if (createdChat) {
        await ctx.db.insert(message).values({
          hasSkip: false,
          hasValidation: false,
          messageType: "DEFAULT",
          role: "AI",
          text: "Hi, I am LLMind!!! Write me a clinical case and I will response with my Diagnosis",
          chatId: createdChat.id,
          timestamp: new Date(),
        });
        return createdChat;
      }
      throw new Error("Error on creating Chat");
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
  getChat: publicProcedure
    .input(
      z.object({
        userToken: z.number(),
        chatId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const selectedChat = await ctx.db.query.chat.findFirst({
        where: and(eq(chat.userId, input.userToken), eq(chat.id, input.chatId)),
        with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.id)],
          },
        },
      });
      if (!selectedChat) throw new Error("Chat does not exists");
      return selectedChat;
    }),
  updateChat: publicProcedure
    .input(
      z.object({
        chatId: z.number(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(message).values({
        hasSkip: false,
        hasValidation: false,
        messageType: "DEFAULT",
        role: "USER",
        text: input.message,
        chatId: input.chatId,
        timestamp: new Date(),
      });
      // call LLMind
      const llmind = await fetch(env.LLM_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_string: input.message,
        }),
      });
      const llmindResponse = (await llmind.json()) as { output_string: string };
      await ctx.db.insert(message).values({
        hasSkip: false,
        hasValidation: false,
        messageType: "DEFAULT",
        role: "AI",
        text: llmindResponse.output_string,
        chatId: input.chatId,
        timestamp: new Date(),
      });
    }),
});
