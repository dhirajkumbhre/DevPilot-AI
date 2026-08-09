import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| POST /api/projects
|
| This route is protected.
|
| The request must contain a valid JWT before the
| createProject controller is allowed to run.
|
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticateUser,
    createProject
);

export default router;