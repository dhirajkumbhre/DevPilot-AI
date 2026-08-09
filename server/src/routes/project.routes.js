import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js";

const router = express.Router();

/*
 * Create Project
 *
 * This route is protected.
 * The user must provide a valid JWT.
 *
 * POST /api/projects
 */
router.post(
  "/",
  authenticateUser,
  createProject
);

export default router;