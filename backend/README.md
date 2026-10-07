# Smart Home backend

Express 5 + MySQL (`mysql2`) REST API for the Smart Home Expo app.
Written in TypeScript, published as ESM.

## Architecture

```
routes ──► controllers ──► services ──► repositories ──► mysql2 pool ──► MySQL
 (HTTP)      (parse/status)  (rules/DTOs)   (ONLY place with SQL)
```

- **Routes** never contain SQL or business logic.
- **Repositories** are the only modules that run queries.
- **Services** map rows → API DTOs and enforce rules (e.g. 404 on missing device).

```
src/
  app.ts                 Express app factory (middleware + route mounting)
  index.ts               entry point (listen + graceful shutdown)
  config/env.ts          typed, single-source runtime configuration
  db/pool.ts             shared mysql2 pool + health probe
  repositories/          SQL for devices & sensor readings
  services/              business logic and row → DTO mapping
  controllers/           request parsing and responses
  routes/                path wiring only
  middleware/            404 + centralised error handling
  types/                 database rows and API DTOs
sql/
  schema.sql             database + tables
  seed.sql               re-runnable development seed data
```

## Endpoints

| Method  | Path                     | Purpose                          |
| ------- | ------------------------ | -------------------------------- |
| `GET`   | `/health`                | Gateway probe → `{ status, connected, database, timestamp }` |
| `GET`   | `/api/devices`           | List devices                     |
| `GET`   | `/api/devices/:id`       | Fetch one device                 |
| `PATCH` | `/api/devices/:id`       | Set power state `{ "status": true }` |
| `GET`   | `/api/sensors/latest`    | Most recent reading              |
| `POST`  | `/api/sensors/readings`  | Store a reading                  |

## Setup

```bash
cd backend
npm install

# 1. Create the schema, then load the seed data.
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql

# 2. Configure and run.
cp .env.example .env      # then edit DB_* values
npm run dev               # tsx watch, http://localhost:3000
```

Production build:

```bash
npm run build   # emits dist/
npm start       # node dist/index.js
```

## Configuration

All settings come from environment variables (loaded from `.env` via Node's
built-in loader — no dotenv dependency). See `.env.example`. The app is pointed
here with `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_USE_MOCK_API=false`; see
`../docs/backend-integration.md`.
