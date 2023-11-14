import { TRPCError } from "@trpc/server";
import { and, eq, gte, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { villager } from "~/server/db/schema";

export const villagerRouter = createTRPCRouter({
  getVillagers: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const name = input.name ? "%" + input.name + "%" : "%%";
      const limit = input.limit ?? 50;
      const villagers = await ctx.db
        .select()
        .from(villager)
        .orderBy(villager.id)
        .limit(limit + 1)
        .where(
          and(
            gte(villager.id, input.cursor ? input.cursor : 0),
            ilike(villager.name, name),
          ),
        );
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (villagers.length > limit) {
        nextCursor = villagers.pop()!.id;
      }
      return { villagers, nextCursor };
    }),

  getMatchup: publicProcedure.query(async ({ ctx }) => {
    const villagers = await ctx.db
      .select({ id: villager.id, name: villager.name, photo: villager.photo })
      .from(villager);
    const villager1 = villagers[Math.floor(Math.random() * villagers.length)]!;
    const villager2 = villagers.filter((v) => v.id !== villager1?.id)[
      Math.floor(Math.random() * villagers.length - 1)
    ]!;
    return { villager1, villager2 };
  }),

  vote: publicProcedure
    .input(z.object({ voteForId: z.number(), voteAgainstId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const villagers = await ctx.db
        .select({
          id: villager.id,
          votesFor: villager.votesFor,
          votesAgainst: villager.votesAgainst,
          rating: villager.rating,
        })
        .from(villager)
        .where(
          or(
            eq(villager.id, input.voteForId),
            eq(villager.id, input.voteAgainstId),
          ),
        );
      if (villagers.length !== 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide two distinct villager id's",
        });
      }
      const villager1 = villagers.filter((v) => v.id === input.voteForId)[0]!;
      const villager2 = villagers.filter(
        (v) => v.id === input.voteAgainstId,
      )[0]!;
      const expected1 =
        1 / (1 + 10 ** ((villager2.rating - villager1.rating) / 400));
      const expected2 =
        1 / (1 + 10 ** ((villager1.rating - villager2.rating) / 400));
      const newRating1 = villager1.rating + 32 * (1 - expected1);
      const newRating2 = villager1.rating + 32 * (0 - expected2);
      try {
        await ctx.db.transaction(async (tx) => {
          await tx
            .update(villager)
            .set({ votesFor: villager1.votesFor + 1, rating: newRating1 })
            .where(eq(villager.id, villager1.id));
          await tx
            .update(villager)
            .set({
              votesAgainst: villager2.votesAgainst + 1,
              rating: newRating2,
            })
            .where(eq(villager.id, villager2.id));
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
      return { message: "Vote success" };
    }),
});
