/* eslint-disable no-console */
const fmt = (level, msg) => `[${new Date().toISOString()}] [${level}] ${msg}`;

export const logger = {
    info: (msg) => console.log(fmt("INFO", msg)),
    warn: (msg) => console.warn(fmt("WARN", msg)),
    error: (msg) => console.error(fmt("ERROR", msg)),
    debug: (msg) => {
        if (process.env.NODE_ENV !== "production") console.log(fmt("DEBUG", msg));
    },
};
