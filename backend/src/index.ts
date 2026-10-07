import { createApp } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection, closePool } from './db/pool.js';

/**
 * Server entry point: starts Express, probes MySQL (best-effort, so a down
 * database does not stop the HTTP server) and installs graceful shutdown.
 */
async function main(): Promise<void> {
    const app = createApp();

    const server = app.listen(env.port, env.host, () => {
        console.log(
            `[smarthome-backend] listening on http://${env.host}:${env.port} (${env.nodeEnv})`
        );
    });

    const databaseUp = await checkDatabaseConnection();

    console.log(
        `[smarthome-backend] database "${env.database.database}" is ${
            databaseUp ? 'reachable' : 'unreachable'
        }`
    );

    const shutdown = (signal: NodeJS.Signals): void => {
        console.log(
            `[smarthome-backend] received ${signal}, shutting down...`
        );

        server.close(() => {
            void closePool()
                .catch(() => undefined)
                .finally(() => process.exit(0));
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

main().catch((error) => {
    console.error('[smarthome-backend] failed to start', error);
    process.exit(1);
});
