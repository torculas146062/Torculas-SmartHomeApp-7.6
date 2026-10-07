/**
 * Error type carrying an HTTP status code.
 *
 * Anything thrown as an `HttpError` is surfaced to the client verbatim by the
 * error middleware; any other error is reported as a generic `500` so internal
 * details never leak.
 */
export class HttpError extends Error {
    readonly status: number;

    readonly code: string;

    readonly details?: unknown;

    constructor(
        status: number,
        message: string,
        options: { code?: string; details?: unknown } = {}
    ) {
        super(message);

        this.name = 'HttpError';
        this.status = status;
        this.code = options.code ?? 'error';
        this.details = options.details;

        // Keeps `instanceof` working when down-levelled by older tooling.
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    static badRequest(message: string, details?: unknown): HttpError {
        return new HttpError(400, message, {
            code: 'bad_request',
            details,
        });
    }

    static notFound(message: string, details?: unknown): HttpError {
        return new HttpError(404, message, {
            code: 'not_found',
            details,
        });
    }

    static internal(message: string, details?: unknown): HttpError {
        return new HttpError(500, message, {
            code: 'internal_error',
            details,
        });
    }
}
