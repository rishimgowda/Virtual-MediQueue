import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export const signAccessToken = (payload) =>
    jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });

export const signRefreshToken = (payload) =>
    jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret);

/** ms helper since cookie maxAge is in ms */
const parseExpiry = (str) => {
    // supports "15m", "1h", "7d"; defaults to 15m
    const m = String(str).match(/^(\d+)([smhd])$/);
    if (!m) return 15 * 60 * 1000;
    const [, n, unit] = m;
    const mult = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return Number(n) * mult[unit];
};

export const cookieOptions = (kind = "access") => ({
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge:
        kind === "refresh"
            ? parseExpiry(config.jwt.refreshExpiresIn)
            : parseExpiry(config.jwt.accessExpiresIn),
    path: "/",
});
