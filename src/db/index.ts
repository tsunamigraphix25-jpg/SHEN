import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const createFallbackDb = () => {
  const buildQuery = () => ({
    from: () => buildQuery(),
    where: () => buildQuery(),
    orderBy: () => buildQuery(),
    limit: async () => [],
    returning: async () => [],
  });

  return {
    select: () => buildQuery(),
    insert: () => ({
      values: async () => ({ returning: async () => [] }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({ returning: async () => [] }),
      }),
    }),
    delete: () => ({
      where: async () => undefined,
    }),
  } as any;
};

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ?? new Pool({ connectionString: databaseUrl }))
  : undefined;

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const isDatabaseConfigured = Boolean(databaseUrl);

export const db = isDatabaseConfigured ? drizzle(pool as Pool) : createFallbackDb();

if (!isDatabaseConfigured) {
  console.warn("DATABASE_URL is not configured. Running with empty fallback data so the app can still render.");
}
