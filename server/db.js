// Server-only Postgres access. DATABASE_URL is set automatically when a Neon
// database is connected to the Vercel project (Storage → Neon); Neon is reached
// with its serverless driver over HTTP. Any other Postgres URL (for example a
// local database while testing) uses the standard `pg` driver instead.
// The single `records` table is created on first use, so there is no migration step.
import { neon } from "@neondatabase/serverless";

let sqlClient;
let ready = null;

function connectionString() {
  const env = globalThis.process?.env || {};
  return env.DATABASE_URL || env.POSTGRES_URL || env.DATABASE_URL_UNPOOLED || "";
}

export function hasDatabase() {
  return Boolean(connectionString());
}

// Several serverless instances can start at the same moment on a fresh
// database. Each runs the bootstrap inside one transaction that first takes a
// transaction-scoped advisory lock, so only one instance creates the table at
// a time and the others then see it already exists.
const BOOTSTRAP_LOCK_KEY = 4404401; // any constant; shared by every instance
const BOOTSTRAP_STATEMENTS = [
  `SELECT pg_advisory_xact_lock(${BOOTSTRAP_LOCK_KEY})`,
  `CREATE TABLE IF NOT EXISTS records (
    entity text NOT NULL,
    id text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_date timestamptz NOT NULL DEFAULT now(),
    updated_date timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (entity, id)
  )`,
  `CREATE INDEX IF NOT EXISTS records_data_gin ON records USING gin (data jsonb_path_ops)`,
];

// "Already exists" races that can still slip through (for example from an
// older deployment without the lock) are harmless: the object exists.
const ALREADY_EXISTS = new Set(["23505", "42P07", "42710"]);

function isNeonUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".neon.tech") || host.endsWith(".neon.build");
  } catch {
    return false;
  }
}

// Both clients expose the same two calls: query(text, params) → rows, and
// runTransaction([statements]) which runs them in one transaction.
function neonClient(url) {
  const sql = neon(url);
  return {
    query: (text, params = []) => sql.query(text, params),
    runTransaction: (statements) => sql.transaction(statements.map((text) => sql.query(text, []))),
  };
}

async function pgClient(url) {
  const { default: pg } = await import("pg");
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const pool = new pg.Pool({ connectionString: url, max: 5, ssl: local ? false : { rejectUnauthorized: false } });
  return {
    query: async (text, params = []) => (await pool.query(text, params)).rows,
    runTransaction: async (statements) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const text of statements) await client.query(text);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK").catch(() => null);
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function bootstrap(sql) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await sql.runTransaction(BOOTSTRAP_STATEMENTS);
      return;
    } catch (error) {
      lastError = error;
      if (!ALREADY_EXISTS.has(error?.code)) throw error;
      await sleep(50 * (attempt + 1));
    }
  }
  throw lastError;
}

export async function getSql() {
  if (!sqlClient) {
    const url = connectionString();
    if (!url) {
      const error = new Error("DATABASE_URL is not set. Connect a Neon database to this project.");
      error.code = "NO_DATABASE";
      throw error;
    }
    const pending = isNeonUrl(url) ? Promise.resolve(neonClient(url)) : pgClient(url);
    sqlClient = pending;
    pending.catch(() => {
      if (sqlClient === pending) sqlClient = null;
    });
  }
  const client = await sqlClient;
  if (!ready) {
    // A failed bootstrap is never cached: the next request tries again.
    const attempt = bootstrap(client);
    ready = attempt;
    attempt.catch(() => {
      if (ready === attempt) ready = null;
    });
  }
  await ready;
  return client;
}
