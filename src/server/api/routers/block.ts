import { eq, or } from "drizzle-orm";
import { diagnosis, message } from "~/server/db/schema";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const blockRouter = createTRPCRouter({
  getBlocks: publicProcedure.query(async ({ ctx }) => {
    // get validated diagnosis
    const validated = await ctx.db.query.diagnosis.findMany({
      where: eq(diagnosis.currentOperation, "FINISHED"),
      with: {
        blockMessages: {
          orderBy: (blockMessages, { asc }) => [asc(blockMessages.orderNumber)],
        },
      },
    });
    // get in-progress diagnosis
    const inProgress = await ctx.db.query.diagnosis.findFirst({
      where: or(
        eq(diagnosis.currentOperation, "NOTE"),
        eq(diagnosis.currentOperation, "SCORE"),
      ),
      with: {
        blockMessages: {
          orderBy: (blockMessages, { asc }) => [asc(blockMessages.orderNumber)],
        },
      },
    });
    if (inProgress == undefined) {
      const newBlock = await ctx.db.query.diagnosis.findFirst({
        where: eq(diagnosis.currentOperation, "VALIDATION"),
        with: {
          blockMessages: {
            orderBy: (blockMessages, { asc }) => [
              asc(blockMessages.orderNumber),
            ],
          },
        },
      });
      return {
        validated: validated,
        current: newBlock,
      };
    }
    return {
      validated: validated,
      current: inProgress,
    };
  }),
  updateBlock: publicProcedure
    .input(
      z.object({
        blockId: z.number(),
        messageId: z.number(),
        currentblockOperation: z.enum([
          "VALIDATION",
          "SCORE",
          "NOTE",
          "FINISHED",
        ]),
        response: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.currentblockOperation) {
        case "VALIDATION": {
          const validationResponse =
            input.response == "Yes" ? "CORRECT" : "INCORRECT";
          await ctx.db
            .update(diagnosis)
            .set({ currentOperation: "SCORE", validation: validationResponse })
            .where(eq(diagnosis.id, input.blockId));
          await ctx.db
            .update(message)
            .set({ hasValidation: false })
            .where(eq(message.id, input.messageId));
          await ctx.db.insert(message).values([
            {
              hasValidation: false,
              messageType: "DEFAULT",
              role: "USER",
              text: `The answer has been validated as ${validationResponse}`,
              timestamp: new Date(),
              orderNumber: 3,
              diagnosisBlock: input.blockId,
            },
            {
              hasValidation: false,
              messageType: "DEFAULT",
              role: "AI",
              text: "Validate the answer with a score from 0 to 1 ",
              timestamp: new Date(),
              orderNumber: 4,
              diagnosisBlock: input.blockId,
            },
          ]);
          break;
        }
        case "NOTE": {
          await ctx.db
            .update(diagnosis)
            .set({ currentOperation: "FINISHED", score: input.response })
            .where(eq(diagnosis.id, input.blockId));
          await ctx.db.insert(message).values({
            hasValidation: false,
            messageType: "DEFAULT",
            role: "USER",
            text: input.response,
            timestamp: new Date(),
            orderNumber: 7,
            diagnosisBlock: input.blockId,
          });
          break;
        }
        case "SCORE": {
          await ctx.db
            .update(diagnosis)
            .set({ currentOperation: "NOTE", score: input.response })
            .where(eq(diagnosis.id, input.blockId));
          await ctx.db.insert(message).values([
            {
              hasValidation: false,
              messageType: "DEFAULT",
              role: "USER",
              text: input.response,
              timestamp: new Date(),
              orderNumber: 5,
              diagnosisBlock: input.blockId,
            },
            {
              hasValidation: false,
              messageType: "DEFAULT",
              role: "AI",
              text: "Would you like to add any additional notes?",
              timestamp: new Date(),
              orderNumber: 6,
              diagnosisBlock: input.blockId,
            },
          ]);
          break;
        }
        case "FINISHED": {
          break;
        }
      }
    }),
});
