import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { isProd } from "../config/index.js";

// 404 handler — must be mounted after all routes
export const notFound = (req, _res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
    let status = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let details = err.details;

    // Mongoose validation
    if (err.name === "ValidationError") {
        status = 400;
        message = "Validation failed";
        details = Object.values(err.errors).map((e) => ({
            path: e.path,
            message: e.message,
        }));
    }
    // Duplicate key
    if (err.code === 11000) {
        status = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `${field} already in use`;
    }
    // CastError (bad ObjectId)
    if (err.name === "CastError") {
        status = 400;
        message = `Invalid ${err.path}`;
    }

    if (status >= 500) {
        logger.error(`${req.method} ${req.originalUrl} -> ${status}: ${err.stack || err.message}`);
    } else {
        logger.warn(`${req.method} ${req.originalUrl} -> ${status}: ${message}`);
    }

    res.status(status).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(isProd ? {} : { stack: err.stack }),
    });
};
