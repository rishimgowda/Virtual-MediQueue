import { ApiError } from "../utils/ApiError.js";

/**
 * Returns a middleware that validates req.body, req.params, req.query
 * using a Zod schema. On success it replaces those fields with the parsed
 * (coerced) values so controllers can trust types.
 */
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (!result.success) {
        const details = result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
        }));
        return next(new ApiError(400, "Validation failed", details));
    }
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;
    next();
};
