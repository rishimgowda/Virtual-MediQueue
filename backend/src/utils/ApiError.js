/**
 * Application-level error with HTTP status code.
 * Throw this from controllers/services for predictable error responses.
 */
export class ApiError extends Error {
    constructor(statusCode, message, details = undefined) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

/** Wraps an async route handler so rejections are forwarded to next(). */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
