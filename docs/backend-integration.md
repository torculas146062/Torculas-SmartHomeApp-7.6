# Backend integration

The app is wired to talk to a REST IoT backend. Nothing in the UI talks to the
network directly — data flows through one direction only:

```
Screens ──► IoTContext ──► IoTService ──► httpClient ──► IoT backend
                                    └────► IoTMockService (mock mode)
```

## Switching the app over

1. Copy `.env.example` to `.env`.
2. Point it at the backend and disable the simulation:

```ini
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_USE_MOCK_API=false
```

3. Restart the dev server (Expo inlines `EXPO_PUBLIC_*` values at bundle time)
   and reload the app.

To keep developing without a backend, leave `EXPO_PUBLIC_USE_MOCK_API=true` —
the in-memory simulation in `src/services/mock/IoTMockService.ts` answers all
calls.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | Backend base URL, no trailing slash. |
| `EXPO_PUBLIC_USE_MOCK_API` | `true` | `true` = local simulation, `false` = real backend. |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | `10000` | Abort API requests slower than this. |
| `EXPO_PUBLIC_HEALTHCHECK_TIMEOUT_MS` | `5000` | Timeout for the gateway health probe. |
| `EXPO_PUBLIC_MOCK_FAILURE_RATE` | `0.15` | Simulated failure probability (mock mode only). |

> `EXPO_PUBLIC_*` values are embedded in the client bundle in plain text. Never
> put secrets in `.env` — use a server-side BFF/token exchange instead.

## Expected REST contract

### `GET /health`

Gateway probe used on app start and by the Settings "Reconnect" action.

```json
{ "status": "ok", "connected": true }
```

Any `2xx` response counts as connected. If `connected` is present and `false`,
the gateway is treated as down. Network errors, timeouts and non-`2xx` statuses
also result in a disconnected state.

### `GET /api/devices`

```json
[
  {
    "id": 1,
    "name": "Living Room Light",
    "type": "Smart Light",
    "status": true,
    "room": "Living Room"
  }
]
```

A `{ "data": [...] }`, `{ "items": [...] }` or `{ "devices": [...] }` envelope is
also accepted. Recognised fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Number or UUID string. |
| `name` | yes | Display name. |
| `type` | yes | Drives the icon shown (`src/utils/deviceIcons.ts`); unknown types fall back to a generic chip icon. |
| `status` | yes | Boolean power state. `isOn` is accepted as an alias. |
| `room` | no | Optional location label. |

### `PATCH /api/devices/:id`

Request body:

```json
{ "status": true }
```

Responds with the updated device in the same shape as `GET /api/devices`. The UI
applies the change optimistically and rolls back if the request fails.

### `GET /api/sensors/latest`

```json
{ "temperature": 27, "humidity": 61, "lightLevel": 540 }
```

`light_level` is accepted as an alias for `lightLevel`.

## Error handling

Every transport failure is normalised into an `ApiError`
(`src/services/api/ApiError.ts`) with a `code` of `network_error`, `timeout`,
`cancelled`, `http_error` or `invalid_json`, plus the HTTP `status` when one was
received. Error envelopes of the form `{ message }`, `{ error }`,
`{ error: { message } }`, `{ detail }` or `{ title }` are surfaced to the user
verbatim; anything else falls back to a generic message.

## Adding authentication

`httpClient` already supports bearer tokens:

```ts
import { setAuthToken } from './src/services/IoTService';

setAuthToken(token);   // attaches `Authorization: Bearer <token>`
setAuthToken(null);    // on sign-out
```

Call it from the future auth flow — no other change is required.

## Where to add new endpoints

1. Describe the response shape in `src/services/api/dto.ts`.
2. Map it onto an app model in `src/services/api/mappers.ts`.
3. Add the path to `endpoints` in `src/config/environment.ts`.
4. Expose it from `src/services/IoTService.ts` (and mirror it in
   `src/services/mock/IoTMockService.ts` so mock mode keeps working).
