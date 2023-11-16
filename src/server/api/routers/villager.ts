import { TRPCError } from "@trpc/server";
import { InferInsertModel, and, desc, eq, gte, ilike, or } from "drizzle-orm";
import { number, z } from "zod";

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
      Math.floor(Math.random() * (villagers.length - 1))
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
      const newRating1 = Math.round(villager1.rating + 32 * (1 - expected1));
      const newRating2 = Math.round(villager2.rating + 32 * (0 - expected2));
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

  getLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const villagers = await ctx.db
      .select({
        id: villager.id,
        name: villager.name,
        icon: villager.icon,
        votesFor: villager.votesFor,
        votesAgainst: villager.votesAgainst,
        rating: villager.rating,
      })
      .from(villager)
      .orderBy(desc(villager.rating));
    let rank = 1;
    const leaderboard = villagers.map((v, index) => ({
      rank:
        index > 0 && villagers[index - 1]?.rating === v.rating
          ? rank
          : (rank = index + 1),
      winRate:
        v.votesFor + v.votesAgainst === 0
          ? 0
          : Math.round((v.votesFor / (v.votesFor + v.votesAgainst)) * 100),
      ...v,
    }));
    return leaderboard;
  }),

  getStatistics: publicProcedure.query(async ({ ctx }) => {
    const villagers = await ctx.db
      .select({
        species: villager.species,
        gender: villager.gender,
        personality: villager.personality,
        subtype: villager.subtype,
        rating: villager.rating,
      })
      .from(villager);

    interface Stats {
      [key: string]: { ratingSum: number; count: number };
    }

    interface ComputedStats {
      [key: string]: number;
    }

    let speciesStats: Stats = {};
    villagers.forEach((v) => {
      if (!speciesStats.hasOwnProperty(v.species)) {
        speciesStats[v.species] = { ratingSum: 0, count: 0 };
      }
      speciesStats[v.species]!["ratingSum"] += v.rating;
      speciesStats[v.species]!["count"] += 1;
    });
    let speciesData: ComputedStats = {};
    for (const s in speciesStats) {
      speciesData[s] =
        speciesStats[s]!["ratingSum"] / speciesStats[s]!["count"];
    }

    let genderStats: Stats = {};
    villagers.forEach((v) => {
      if (!genderStats.hasOwnProperty(v.gender)) {
        genderStats[v.gender] = { ratingSum: 0, count: 0 };
      }
      genderStats[v.gender]!["ratingSum"] += v.rating;
      genderStats[v.gender]!["count"] += 1;
    });
    let genderData: ComputedStats = {};
    for (const g in genderStats) {
      genderData[g] = genderStats[g]!["ratingSum"] / genderStats[g]!["count"];
    }

    let personalityStats: Stats = {};
    villagers.forEach((v) => {
      if (!personalityStats.hasOwnProperty(v.personality)) {
        personalityStats[v.personality] = { ratingSum: 0, count: 0 };
      }
      personalityStats[v.personality]!["ratingSum"] += v.rating;
      personalityStats[v.personality]!["count"] += 1;
    });
    let personalityData: ComputedStats = {};
    for (const p in personalityStats) {
      personalityData[p] =
        personalityStats[p]!["ratingSum"] / personalityStats[p]!["count"];
    }

    let subtypeStats: Stats = {};
    villagers.forEach((v) => {
      if (!subtypeStats.hasOwnProperty(v.subtype)) {
        subtypeStats[v.subtype] = { ratingSum: 0, count: 0 };
      }
      subtypeStats[v.subtype]!["ratingSum"] += v.rating;
      subtypeStats[v.subtype]!["count"] += 1;
    });
    let subtypeData: ComputedStats = {};
    for (const s in subtypeStats) {
      subtypeData[s] =
        subtypeStats[s]!["ratingSum"] / subtypeStats[s]!["count"];
    }

    const statistics = [
      { title: "Species", data: speciesData },
      { title: "Gender", data: genderData },
      { title: "Personality", data: personalityData },
      { title: "Subtype", data: subtypeData },
    ];
    return statistics;
  }),
});
