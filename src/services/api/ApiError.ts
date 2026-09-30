/**
 * Transport-level failure codes surfaced by the HTTP client.
 */
export type ApiErrorCode =
    | 'network_error'
    | 'timeout'
    | 'cancelled'
    | 'http_error'
    | 'invalid_json';

type ApiErrorOptions = {
    code: ApiErrorCode;
    status?: number | null;
    /** Raw response body or underlying error, useful for logging. */
    details?: unknown;
};

/**
 * Normalised error type for every backend interaction, so callers never have
 * to reason about `fetch` internals, HTTP status codes or abort signals.
 */
export class ApiError extends Error {
    readonly code: ApiErrorCode;

    /** HTTP status code, or `null` when the request never reached the server. */
    readonly status: number | null;

    readonly details: unknown;

    constructor(message: string, options: ApiErrorOptions) {
        super(message);

        this.name = 'ApiError';
        this.code = options.code;
        this.status = options.status ?? null;
        this.details = options.details;

        // Keeps `instanceof ApiError` working when the class is transpiled
        // down to ES5 by older tooling.
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    /** True when the backend could not be reached at all. */
    get isConnectivityError(): boolean {
        return this.code === 'network_error' || this.code === 'timeout';
    }

    /** True when the backend reports the caller is not authenticated. */
    get isUnauthorized(): boolean {
        return this.status === 401 || this.status === 403;
    }
}

/**
 * Produces a message that is safe to show in the UI.
 *
 * Server-authored messages are passed through (`ApiError` only ever carries
 * messages extracted from the response body or generated locally).
 */
export function describeError(cause: unknown, fallback: string): string {
    if (cause instanceof ApiError) {
        return cause.message || fallback;
    }

    return fallback;
}
