import mongoose from "mongoose";
import { config } from "./index.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
    try {
        const conn = await mongoose.connect(config.db.uri, {
            dbName: config.db.name,
            serverSelectionTimeoutMS: 10_000,
        });
        logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

        mongoose.connection.on("error", (err) => {
            logger.error(`MongoDB error: ${err.message}`);
        });

        return conn;
    } catch (err) {
        logger.error(`MongoDB connection failed: ${err.message}`);
        throw err;
    }
}
