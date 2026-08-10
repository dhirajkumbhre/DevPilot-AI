/*
|--------------------------------------------------------------------------
| File        : project.controller.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Handles HTTP requests related to projects.
|
| The controller:
|
| 1. Receives the request.
| 2. Validates basic input.
| 3. Gets the authenticated user's ID.
| 4. Calls the appropriate service.
| 5. Sends the HTTP response.
|
| Business/database logic stays inside project.service.js.
|--------------------------------------------------------------------------
*/

import {
    createProjectService,
    getUserProjectsService,
    getProjectByIdService,
    updateProjectService,
    deleteProjectService,
    getProjectFilesService,
} from "../services/project.service.js";


/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| POST /api/projects
|
| Creates a new project for the authenticated user.
|--------------------------------------------------------------------------
*/

export const createProject = async (req, res) => {

    try {

        const { name, description } = req.body;

        /*
        Basic validation.
        A project must have a name.
        */

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        /*
        req.user was created by auth.middleware.js.

        The JWT contains the user's ID:

        JWT
         ↓
        auth.middleware
         ↓
        req.user.userId
        */

        const project = await createProjectService({
            name,
            description,
            userId: req.user.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });

    } catch (error) {

        console.error(
            "Create project error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
};


/*
|--------------------------------------------------------------------------
| Get My Projects
|--------------------------------------------------------------------------
|
| GET /api/projects
|
| Returns all projects belonging to the authenticated user.
|--------------------------------------------------------------------------
*/

export const getUserProjects = async (req, res) => {

    try {

        /*
        We get the user ID from the verified JWT.
        */

        const projects = await getUserProjectsService(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            projects,
        });

    } catch (error) {

        console.error(
            "Get projects error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};


/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
|
| GET /api/projects/:id
|
| Returns one project belonging to the authenticated user.
|--------------------------------------------------------------------------
*/

export const getProjectById = async (req, res) => {

    try {

        /*
        :id comes from the URL.

        Example:

        GET /api/projects/65abc123

        req.params.id
        */

        const { id } = req.params;

        const project = await getProjectByIdService({

            projectId: id,

            userId: req.user.userId,
        });

        return res.status(200).json({
            success: true,
            project,
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
|
| PUT /api/projects/:id
|
| Updates a project belonging to the authenticated user.
|--------------------------------------------------------------------------
*/

export const updateProject = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            description,
        } = req.body;

        /*
        The service checks both:

        project ID
        +
        authenticated user ID

        This prevents users from modifying someone else's
        project.
        */

        const project = await updateProjectService({

            projectId: id,

            userId: req.user.userId,

            name,

            description,
        });

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
|
| DELETE /api/projects/:id
|
| Deletes a project belonging to the authenticated user.
|--------------------------------------------------------------------------
*/

export const deleteProject = async (req, res) => {

    try {

        const { id } = req.params;

        /*
        The service makes sure the project belongs to
        the authenticated user before deleting it.
        */

        await deleteProjectService({

            projectId: id,

            userId: req.user.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
/*
|--------------------------------------------------------------------------
| Get Project Files
|--------------------------------------------------------------------------
|
| GET /api/projects/:id/files
|
| Returns the files belonging to the authenticated user's project.
|
|--------------------------------------------------------------------------
*/

export const getProjectFiles = async (req, res) => {

    try {

        /*
        --------------------------------------------------------------
        | Get Project ID
        --------------------------------------------------------------
        |
        | Example:
        |
        | /api/projects/64abc123/files
        |
        | req.params.id
        |
        --------------------------------------------------------------
        */

        const { id } = req.params;


        /*
        --------------------------------------------------------------
        | Get Files From Service
        --------------------------------------------------------------
        |
        | The service also checks project ownership.
        |
        --------------------------------------------------------------
        */

        const files = await getProjectFilesService({

            projectId: id,

            userId: req.user.userId,
        });


        /*
        --------------------------------------------------------------
        | Send Successful Response
        --------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            files,
        });

    } catch (error) {

        console.error(
            "Get project files error:",
            error.message
        );


        return res.status(404).json({

            success: false,

            message: error.message,
        });
    }
};