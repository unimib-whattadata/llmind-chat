import { user } from "~/server/db/schema";
import { seedDiagnosis } from "~/server/db/seed";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  authenticate: publicProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }): Promise<number> => {
      //check if user exists
      const currentUser = await ctx.db.query.user.findFirst({
        where: eq(user.email, input),
      });
      // IF YES
      // return user token
      if (currentUser != undefined) return currentUser.id;
      // IF NOT:
      // create a user
      const newUser = await ctx.db
        .insert(user)
        .values({
          email: input,
        })
        .returning({ insertedId: user.id });
      const insertedUser = newUser[0];
      if (insertedUser) {
        // create a new diagnosis associated to user
        await seedDiagnosis(insertedUser.insertedId);
        // return user token
        return insertedUser.insertedId;
      }
      throw Error("Error during registration");
    }),
});
