/*
--------------------------------------------------------------
| File        : project.routes.js
| Project     : DevPilot AI
--------------------------------------------------------------
|
| Purpose:
| Defines all API routes related to projects.
|
| Every project route is protected by JWT authentication.
|
--------------------------------------------------------------
*/

import express from "express";

/*
--------------------------------------------------------------
| Authentication Middleware
--------------------------------------------------------------
|
| This middleware checks the JWT before allowing the request
| to reach the controller.
|
*/

import authenticateUser from "../middleware/auth.middleware.js";

/*
--------------------------------------------------------------
| Project Controllers
--------------------------------------------------------------
|
| Controllers handle the HTTP request/response.
|
*/

import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectFiles,
} from "../controllers/project.controller.js";


const router = express.Router();


/*
==============================================================
| CREATE PROJECT
==============================================================
|
| POST /api/projects
|
| Creates a new project for the authenticated user.
|
*/

router.post(
    "/",
    authenticateUser,
    createProject
);


/*
==============================================================
| GET MY PROJECTS
==============================================================
|
| GET /api/projects
|
| Returns all projects belonging to the logged-in user.
|
*/

router.get(
    "/",
    authenticateUser,
    getUserProjects
);


/*
==============================================================
| GET SINGLE PROJECT
==============================================================
|
| GET /api/projects/:id
|
| Returns one project.
|
| Example:
|
| GET /api/projects/64abc123...
|
*/

router.get(
    "/:id",
    authenticateUser,
    getProjectById
);




/*
|--------------------------------------------------------------------------
| GET PROJECT FILES
|--------------------------------------------------------------------------
|
| GET /api/projects/:id/files
|
| Returns all files belonging to the project.
|
| Authentication is required.
|
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/files",
    authenticateUser,
    getProjectFiles
);


/*
==============================================================
| UPDATE PROJECT
==============================================================
|
| PUT /api/projects/:id
|
| Updates a project belonging to the logged-in user.
|
*/

router.put(
    "/:id",
    authenticateUser,
    updateProject
);


/*
==============================================================
| DELETE PROJECT
==============================================================
|
| DELETE /api/projects/:id
|
| Deletes a project belonging to the logged-in user.
|
*/

router.delete(
    "/:id",
    authenticateUser,
    deleteProject
);


/*
--------------------------------------------------------------
| Export Router
--------------------------------------------------------------
|
| app.js imports this router as the default export.
|
--------------------------------------------------------------
*/

export default router;