import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import { config, isProd } from "./config/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";

export const buildApp = () => {
    const app = express();

    app.set("trust proxy", 1);

    app.use(helmet());
    app.use(compression());
    app.use(
        cors({
            origin: config.clientOrigin,
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        })
    );
    app.use(express.json({ limit: "10kb" }));
    app.use(express.urlencoded({ extended: true, limit: "10kb" }));
    app.use(cookieParser());
    app.use(mongoSanitize());

    if (!isProd) app.use(morgan("dev"));

    // Global rate limit (login/register routes have a stricter one)
    app.use(
        rateLimit({
            windowMs: 60 * 1000,
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    // Health check
    app.get("/api/health", (_req, res) =>
        res.json({ success: true, status: "ok", uptime: process.uptime() })
    );

    app.use("/api/auth", authRoutes);
    app.use("/api/doctors", doctorRoutes);
    app.use("/api/appointments", appointmentRoutes);
    app.use("/api/contact", contactRoutes);

    app.use(notFound);
    app.use(errorHandler);

    return app;
};
