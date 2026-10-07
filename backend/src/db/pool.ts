import { createPool, type Pool } from 'mysql2/promise';
import { env } from '../config/env.js';

/**
 * Shared MySQL connection pool.
 *
 * `createPool` does not open a socket immediately, so the backend boots even
 * when MySQL is unavailable; reachability is reported on demand through
 * `checkDatabaseConnection`. Every SQL statement lives behind a repository
 * (see `src/repositories/*`) — routes never talk to the pool.
 *
 * Note: no `timezone` override is set, so mysql2 parses timestamps in the
 * server's own time zone. This keeps `recorded_at` values accurate no matter
 * which time zone the MySQL host runs in.
 */
export const pool: Pool = createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database,
    waitForConnections: true,
    connectionLimit: env.database.connectionLimit,
    queueLimit: 0,
    connectTimeout: env.database.connectTimeoutMs,
    supportBigNumbers: true,
});

/** Best-effort liveness probe used by `GET /health`; never throws. */
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        const connection = await pool.getConnection();

        try {
            await connection.ping();
        } finally {
            connection.release();
        }

        return true;
    } catch {
        return false;
    }
}

/** Drains the pool during graceful shutdown. */
export async function closePool(): Promise<void> {
    await pool.end();
}
