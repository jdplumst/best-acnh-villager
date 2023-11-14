// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `best-acnh-villager_${name}`);

export const villager = pgTable(
  "villager",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    icon: text("icon").notNull(),
    photo: text("photo").notNull(),
    species: varchar("species", {
      enum: [
        "alligator",
        "anteater",
        "bear",
        "bird",
        "bull",
        "cat",
        "chicken",
        "cow",
        "cub",
        "deer",
        "dog",
        "duck",
        "eagle",
        "elephant",
        "frog",
        "goat",
        "gorilla",
        "hamster",
        "hippo",
        "horse",
        "kangaroo",
        "koala",
        "lion",
        "monkey",
        "mouse",
        "octopus",
        "ostrich",
        "penguin",
        "pig",
        "rhino",
        "sheep",
        "squirrel",
        "tiger",
        "wolf",
      ],
    }).notNull(),
    gender: varchar("gender", {
      length: 10,
      enum: ["male", "female"],
    }).notNull(),
    personality: varchar("personality", {
      length: 256,
      enum: ["lazy", "normal", "peppy", "jock", "cranky", "snooty"],
    }).notNull(),
    subtype: varchar("subtype", { length: 2, enum: ["A", "B"] }).notNull(),
    hobby: varchar("hobby", {
      length: 256,
      enum: ["Education", "Fashion", "Fitness", "Music", "Nature", "Play"],
    }).notNull(),
    birthday: varchar("birthday", { length: 256 }).notNull(),
    catchphrase: varchar("catchphrase", { length: 256 }).notNull(),
    song: varchar("song", { length: 256 }).notNull(),
    saying: text("saying").notNull(),
    votesFor: integer("votesFor").default(0).notNull(),
    votesAgainst: integer("votesAgainst").default(0).notNull(),
    rating: integer("rating").default(1000).notNull(),
  },
  (table) => ({
    nameIndex: index("name_idx").on(table.name),
  }),
);
