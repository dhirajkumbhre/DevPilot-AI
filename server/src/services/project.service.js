/*
|--------------------------------------------------------------------------
| File        : project.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Contains the business logic for Project operations.
|
| The controller receives the HTTP request.
| This service performs the actual project/database operations.
|
| CRUD:
|
| C - Create
| R - Read
| U - Update
| D - Delete
|
|--------------------------------------------------------------------------
*/

import Project from "../models/project.model.js";


/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| Creates a new project and associates it with the currently
| authenticated user.
|
| userId comes from the JWT authentication middleware.
|--------------------------------------------------------------------------
*/

export const createProjectService = async ({
    name,
    description,
    userId,
}) => {

    const project = await Project.create({

        name,

        description,

        /*
        The owner field connects this project to the user
        who created it.
        */

        owner: userId,
    });

    return project;
};


/*
|--------------------------------------------------------------------------
| Get User Projects
|--------------------------------------------------------------------------
|
| Returns ONLY projects belonging to the authenticated user.
|
| This is important for authorization.
|
| User A should not receive User B's projects.
|--------------------------------------------------------------------------
*/

export const getUserProjectsService = async (userId) => {

    const projects = await Project.find({
        owner: userId,
    })
        .sort({ createdAt: -1 });

    return projects;
};


/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
|
| Finds one project belonging to the authenticated user.
|
| We check BOTH:
|
| 1. Project ID
| 2. Owner ID
|
| This prevents a user from accessing another user's project
| simply by changing the project ID in the URL.
|--------------------------------------------------------------------------
*/

export const getProjectByIdService = async ({
    projectId,
    userId,
}) => {

    const project = await Project.findOne({
        _id: projectId,
        owner: userId,
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};


/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
|
| Updates a project only if it belongs to the authenticated user.
|--------------------------------------------------------------------------
*/

export const updateProjectService = async ({
    projectId,
    userId,
    name,
    description,
}) => {

    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            owner: userId,
        },
        {
            name,
            description,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};


/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
|
| Deletes a project only if it belongs to the authenticated user.
|--------------------------------------------------------------------------
*/

export const deleteProjectService = async ({
    projectId,
    userId,
}) => {

    const project = await Project.findOneAndDelete({
        _id: projectId,
        owner: userId,
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};