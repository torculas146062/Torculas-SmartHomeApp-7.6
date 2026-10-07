import type {
    ErrorRequestHandler,
    RequestHandler,
} from 'express';
import { isProduction } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

/** Terminal 404 handler for unknown routes. */
export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({
        error: {
            code: 'not_found',
            message: `Route ${req.method} ${req.originalUrl} does not exist.`,
        },
    });
};

/**
 * Maps a status code onto an error, preferring explicit HTTP errors but also
 * honouring the `status`/`statusCode` that body-parser attaches to malformed
 * JSON requests.
 */
function resolveStatus(error: unknown): number {
    if (error instanceof HttpError) {
        return error.status;
    }

    const candidate = error as {
        status?: unknown;
        statusCode?: unknown;
    };

    const status =
        typeof candidate?.status === 'number'
            ? candidate.status
            : typeof candidate?.statusCode === 'number'
              ? candidate.statusCode
              : undefined;

    return status && status >= 400 && status < 600 ? status : 500;
}

/**
 * Single error funnel. `HttpError`s are surfaced to the client verbatim; every
 * other failure becomes a generic 500 so internals never leak. The response
 * envelope (`{ error: { message } }`) is one the app already understands.
 */
export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    next
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    const isHttpError = error instanceof HttpError;
    const status = resolveStatus(error);
    const isClientError = status >= 400 && status < 500;

    if (!isHttpError && !isClientError) {
        console.error('[error]', error);
    }

    const message = isHttpError
        ? error.message
        : isClientError && error instanceof Error
          ? error.message
          : 'Internal server error.';

    if (!isProduction && !isHttpError && isClientError) {
        console.warn('[error]', error);
    }

    res.status(status).json({
        error: {
            code: isHttpError
                ? error.code
                : isClientError
                  ? 'bad_request'
                  : 'internal_error',
            message,
        },
    });
};
