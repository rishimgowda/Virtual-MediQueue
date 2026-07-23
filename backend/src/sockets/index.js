import { Server } from "socket.io";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

let io = null;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: config.clientOrigin,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        logger.debug(`socket connected: ${socket.id}`);

        // Subscribe to a doctor's queue
        socket.on("queue:join", (doctorId) => {
            if (typeof doctorId === "string" && /^[0-9a-fA-F]{24}$/.test(doctorId)) {
                socket.join(`queue:${doctorId}`);
            }
        });

        socket.on("queue:leave", (doctorId) => {
            socket.leave(`queue:${doctorId}`);
        });

        socket.on("disconnect", () => {
            logger.debug(`socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

/** Emit a queue update to every client subscribed to a particular doctor. */
export const emitQueueUpdate = (doctorId, payload) => {
    if (!io) return;
    io.to(`queue:${doctorId}`).emit("queue:update", payload);
};

export const getIO = () => io;
