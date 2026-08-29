import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

/*
 * -----------------------------
 * Global Middleware
 * -----------------------------
 */

// Frontend URL configuration.
// Local development uses Vite.
// Production will use the Vercel URL.
const allowedOrigin =
    process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);

// Allow Express to read JSON request bodies.
app.use(express.json());

/*
 * -----------------------------
 * Application Routes
 * -----------------------------
 */

// Health check
app.use("/api/health", healthRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Projects
app.use("/api/projects", projectRoutes);

// AI
app.use("/api/ai", aiRoutes);

export default app;