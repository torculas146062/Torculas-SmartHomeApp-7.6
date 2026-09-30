import { environment } from '../../config/environment';
import { ApiError } from './ApiError';

/**
 * Minimal, dependency-free HTTP client for the IoT backend.
 *
 * Responsibilities:
 *  - build absolute URLs from the configured base URL
 *  - attach JSON headers and the current auth token
 *  - enforce a request timeout
 *  - normalise every failure into an `ApiError`
 *
 * Screens never call this directly — they go through `IoTService`, which maps
 * DTOs onto app models.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<
    string,
    string | number | boolean | null | undefined
>;

export type RequestOptions = {
    method?: HttpMethod;
    /** Serialised to JSON and sent as the request body. */
    body?: unknown;
    /** Appended as a query string; `null`/`undefined` entries are skipped. */
    query?: QueryParams;
    /** Per-request override of the configured timeout. */
    timeoutMs?: number;
    /** Allows a caller (e.g. a screen unmounting) to cancel the request. */
    signal?: AbortSignal;
    /** Escape hatch for headers such as `If-None-Match`. */
    headers?: Record<string, string>;
};

let authToken: string | null = null;

/**
 * Sets the bearer token used for subsequent requests.
 *
 * Wire this up to the auth flow once the backend starts issuing tokens; pass
 * `null` on sign-out to clear it.
 */
export function setAuthToken(token: string | null): void {
    authToken = token;
}

function buildQueryString(query: QueryParams | undefined): string {
    if (!query) {
        return '';
    }

    // Built manually rather than with `URLSearchParams`, whose React Native
    // polyfill is incomplete.
    const parts: string[] = [];

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
            parts.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    String(value)
                )}`
            );
        }
    }

    return parts.length > 0 ? `?${parts.join('&')}` : '';
}

function buildUrl(path: string, query?: QueryParams): string {
    const normalisedPath = path.startsWith('/') ? path : `/${path}`;

    return `${environment.apiBaseUrl}${normalisedPath}${buildQueryString(query)}`;
}

/**
 * Bridges the caller's abort signal to the controller that also handles the
 * timeout, so either source can cancel the in-flight request.
 */
function linkAbortSignal(
    external: AbortSignal | undefined,
    controller: AbortController
): () => void {
    if (!external) {
        return () => {};
    }

    if (external.aborted) {
        controller.abort();

        return () => {};
    }

    const onAbort = () => controller.abort();

    external.addEventListener('abort', onAbort);

    return () => external.removeEventListener('abort', onAbort);
}

async function readPayload(response: Response): Promise<unknown> {
    if (response.status === 204 || response.status === 205) {
        return undefined;
    }

    const text = await response.text();

    if (!text) {
        return undefined;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        try {
            return JSON.parse(text);
        } catch (cause) {
            throw new ApiError(
                'The IoT backend returned malformed JSON.',
                { code: 'invalid_json', status: response.status, details: cause }
            );
        }
    }

    // Some gateways omit the JSON content type — try anyway, fall back to text.
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Bodies longer than this are treated as opaque — typically an HTML error page
 * from a proxy, which must never be shown to the user verbatim.
 */
const MAX_TEXT_ERROR_LENGTH = 300;

/**
 * Extracts a human-readable message from a typical error envelope:
 * `{ message }`, `{ error }`, `{ error: { message } }` or `{ detail }`.
 */
function extractErrorMessage(payload: unknown): string | null {
    if (typeof payload === 'string') {
        const text = payload.trim();

        if (
            !text ||
            text.length > MAX_TEXT_ERROR_LENGTH ||
            text.includes('<')
        ) {
            return null;
        }

        return text;
    }

    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const candidate = payload as Record<string, unknown>;

    const direct =
        candidate.message ?? candidate.error ?? candidate.detail ?? candidate.title;

    if (typeof direct === 'string' && direct.trim()) {
        return direct;
    }

    if (direct && typeof direct === 'object') {
        const nested = (direct as Record<string, unknown>).message;

        if (typeof nested === 'string' && nested.trim()) {
            return nested;
        }
    }

    return null;
}

export async function request<T>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const url = buildUrl(path, options.query);
    const timeoutMs = options.timeoutMs ?? environment.requestTimeoutMs;

    const controller = new AbortController();
    const unlinkSignal = linkAbortSignal(options.signal, controller);

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    try {
        let payload: unknown;

        try {
            const response = await fetch(url, {
                method: options.method ?? 'GET',
                headers: {
                    Accept: 'application/json',
                    ...(options.body !== undefined
                        ? { 'Content-Type': 'application/json' }
                        : {}),
                    ...(authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {}),
                    ...options.headers,
                },
                body:
                    options.body !== undefined
                        ? JSON.stringify(options.body)
                        : undefined,
                signal: controller.signal,
            });

            payload = await readPayload(response);

            if (!response.ok) {
                throw new ApiError(
                    extractErrorMessage(payload) ??
                        `Request failed with status ${response.status}.`,
                    {
                        code: 'http_error',
                        status: response.status,
                        details: payload,
                    }
                );
            }
        } catch (cause) {
            if (cause instanceof ApiError) {
                throw cause;
            }

            if (options.signal?.aborted) {
                throw new ApiError('Request was cancelled.', {
                    code: 'cancelled',
                    details: cause,
                });
            }

            if (controller.signal.aborted) {
                throw new ApiError(
                    `The IoT backend did not respond within ${timeoutMs} ms.`,
                    { code: 'timeout', details: cause }
                );
            }

            throw new ApiError(
                'Could not reach the IoT backend. Check your connection and API URL.',
                { code: 'network_error', details: cause }
            );
        }

        return payload as T;
    } finally {
        clearTimeout(timeoutId);
        unlinkSignal();
    }
}

export const httpClient = {
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(path, { ...options, method: 'GET' }),

    post: <T>(
        path: string,
        body?: unknown,
        options?: Omit<RequestOptions, 'method' | 'body'>
    ) => request<T>(path, { ...options, method: 'POST', body }),

    patch: <T>(
        path: string,
        body?: unknown,
        options?: Omit<RequestOptions, 'method' | 'body'>
    ) => request<T>(path, { ...options, method: 'PATCH', body }),

    delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(path, { ...options, method: 'DELETE' }),
};
