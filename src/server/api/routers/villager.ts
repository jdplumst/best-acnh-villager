import { and, gte, ilike } from "drizzle-orm";
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
});
