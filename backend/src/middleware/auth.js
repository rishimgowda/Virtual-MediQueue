import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Read access token from httpOnly cookie or Authorization: Bearer header.
 * Attaches { id, role } to req.user. Throws 401 if missing/invalid.
 */
export const requireAuth = (req, _res, next) => {
    try {
        const headerToken = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.slice(7)
            : null;
        const token = req.cookies?.accessToken || headerToken;
        if (!token) {
            return next(new ApiError(401, "Authentication required"));
        }
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        next(new ApiError(401, err.name === "TokenExpiredError" ? "Token expired" : "Invalid token"));
    }
};

/** requireRole("admin") or requireRole("doctor", "admin"). */
export const requireRole = (...allowed) => (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!allowed.includes(req.user.role)) {
        return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
};
