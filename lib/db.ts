import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:%40Jki!P3RH%40AVP785@db.bdatamygfkgqbvogivgf.supabase.co:5432/postgres";

// Singleton pool pattern para Next.js
declare global {
  // eslint-disable-next-line no-var
  var __postgresPool: Pool | undefined;
}

export const pool =
  global.__postgresPool ??
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__postgresPool = pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
