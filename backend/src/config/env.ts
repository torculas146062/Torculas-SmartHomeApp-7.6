import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Loads `.env` from the backend root into `process.env` using Node's built-in
 * loader (Node >= 20.12), so the backend carries no runtime dependency on
 * dotenv. Real deployments simply set real environment variables and ship no
 * `.env` file — a missing file is not an error.
 */
function loadDotEnvFile(): void {
    const envPath = resolve(process.cwd(), '.env');

    if (!existsSync(envPath)) {
        return;
    }

    try {
        process.loadEnvFile(envPath);
    } catch (error) {
        console.warn(`[env] could not load ${envPath}:`, error);
    }
}

loadDotEnvFile();

function readString(key: string, fallback: string): string {
    const value = process.env[key]?.trim();

    return value ? value : fallback;
}

function readNumber(key: string, fallback: number, min = 0): number {
    const parsed = Number.parseInt(process.env[key] ?? '', 10);

    return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
}

export type DatabaseConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
    connectTimeoutMs: number;
};

export type BackendEnvironment = {
    nodeEnv: string;
    port: number;
    host: string;
    corsOrigin: string;
    database: DatabaseConfig;
};

/**
 * Single source of truth for every runtime setting. `process.env` is read
 * exactly once, here, so nobody else in the codebase touches it directly.
 */
export const env: BackendEnvironment = {
    nodeEnv: readString('NODE_ENV', 'development'),
    port: readNumber('PORT', 3000, 1),
    host: readString('HOST', '0.0.0.0'),
    corsOrigin: readString('CORS_ORIGIN', '*'),
    database: {
        host: readString('DB_HOST', '127.0.0.1'),
        port: readNumber('DB_PORT', 3306, 1),
        user: readString('DB_USER', 'root'),
        password: process.env.DB_PASSWORD ?? '',
        database: readString('DB_NAME', 'smarthome'),
        connectionLimit: readNumber('DB_CONNECTION_LIMIT', 10, 1),
        connectTimeoutMs: readNumber('DB_CONNECT_TIMEOUT_MS', 3000, 1),
    },
};

export const isProduction = env.nodeEnv === 'production';
