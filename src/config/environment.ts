/**
 * Central runtime configuration.
 *
 * Values are read from `EXPO_PUBLIC_*` environment variables, which Expo CLI
 * inlines at build time from `.env` files. They MUST be referenced statically
 * (`process.env.EXPO_PUBLIC_X`) — dynamic lookups are not inlined.
 *
 * See `.env.example` for the full list of supported variables.
 */

export type AppEnvironment = {
    /** Base URL of the IoT backend, without a trailing slash. */
    apiBaseUrl: string;
    /** Abort requests that take longer than this. */
    requestTimeoutMs: number;
    /** When true, the app talks to the local in-memory simulation instead of the backend. */
    useMockApi: boolean;
    /** Probability (0..1) that a simulated request fails, when `useMockApi` is enabled. */
    mockFailureRate: number;
    /** Timeout used for lightweight gateway health probes. */
    healthCheckTimeoutMs: number;
};

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function readString(value: string | undefined, fallback: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined || value.trim() === '') {
        return fallback;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function readNumber(
    value: string | undefined,
    fallback: number,
    { min = 0, max = Number.MAX_SAFE_INTEGER }: { min?: number; max?: number } = {}
): number {
    const parsed = Number.parseFloat(value ?? '');

    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
        return fallback;
    }

    return parsed;
}

export const environment: AppEnvironment = {
    apiBaseUrl: readString(
        process.env.EXPO_PUBLIC_API_URL,
        DEFAULT_API_BASE_URL
    ).replace(/\/+$/, ''),

    requestTimeoutMs: readNumber(
        process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
        10_000,
        { min: 1 }
    ),

    useMockApi: readBoolean(
        process.env.EXPO_PUBLIC_USE_MOCK_API,
        true
    ),

    mockFailureRate: readNumber(
        process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE,
        0.15,
        { min: 0, max: 1 }
    ),

    healthCheckTimeoutMs: readNumber(
        process.env.EXPO_PUBLIC_HEALTHCHECK_TIMEOUT_MS,
        5_000,
        { min: 1 }
    ),
};

/**
 * REST paths exposed by the IoT backend.
 *
 * Keeping them in one place makes it trivial to re-point the app at a
 * different API version or gateway address.
 */
export const endpoints = {
    health: '/health',
    devices: '/api/devices',
    device: (id: string | number) =>
        `/api/devices/${encodeURIComponent(String(id))}`,
    latestSensors: '/api/sensors/latest',
} as const;
