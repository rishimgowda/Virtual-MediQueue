import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root regardless of where the process is started
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const required = ["MONGODB_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
        `[config] Missing required env vars: ${missing.join(", ")}. ` +
            `Copy .env.example to .env and fill them in.`
    );
    process.exit(1);
}

export const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 8000),
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",

    db: {
        uri: process.env.MONGODB_URI,
        name: process.env.DB_NAME || "MediQueue",
    },

    jwt: {
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshSecret: process.env.REFRESH_TOKEN_SECRET,
        accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    },

    cookie: {
        // Cookies must be 'secure' in production for SameSite=None to work
        secure: (process.env.NODE_ENV || "development") === "production",
        sameSite:
            (process.env.NODE_ENV || "development") === "production"
                ? "none"
                : "lax",
    },

    bcrypt: {
        saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
    },
};

export const isProd = config.env === "production";
