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

// Allow requests from the frontend.
app.use(cors());

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

// Ai Routes 
app.use("/api/ai", aiRoutes);

export default app;