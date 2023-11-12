import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/env.mjs";
import postgres from "postgres";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);
export const db = drizzle(client);
