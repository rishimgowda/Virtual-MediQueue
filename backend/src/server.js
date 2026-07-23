import http from "http";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import { buildApp } from "./app.js";
import { initSocket } from "./sockets/index.js";
import { logger } from "./utils/logger.js";

const start = async () => {
    try {
        await connectDB();
        const app = buildApp();
        const server = http.createServer(app);
        initSocket(server);

        server.listen(config.port, () => {
            logger.info(`API listening on http://localhost:${config.port} (${config.env})`);
        });

        const shutdown = (signal) => async () => {
            logger.info(`${signal} received, shutting down gracefully…`);
            server.close(() => {
                logger.info("HTTP server closed");
                process.exit(0);
            });
            // Force exit if not closed in 10s
            setTimeout(() => process.exit(1), 10_000).unref();
        };
        process.on("SIGINT", shutdown("SIGINT"));
        process.on("SIGTERM", shutdown("SIGTERM"));
    } catch (err) {
        logger.error(`Failed to start: ${err.message}`);
        process.exit(1);
    }
};

start();
