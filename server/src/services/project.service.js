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
import ProjectFile from "../models/projectFile.model.js";

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


/*
|--------------------------------------------------------------------------
| Get Project Files
|--------------------------------------------------------------------------
|
| Returns all files belonging to a project.
|
| IMPORTANT:
|
| We first verify that the project belongs to the authenticated user.
|
| This prevents:
|
| User A
|   ↓
| manually changes project ID
|   ↓
| accesses User B's files
|
|--------------------------------------------------------------------------
*/

export const getProjectFilesService = async ({
    projectId,
    userId,
}) => {

    /*
    ----------------------------------------------------------------------
    | Step 1: Verify Project Ownership
    ----------------------------------------------------------------------
    */

    const project = await Project.findOne({
        _id: projectId,
        owner: userId,
    });

    /*
    If the project doesn't belong to the user,
    don't return any files.
    */

    if (!project) {

        throw new Error(
            "Project not found"
        );
    }


    /*
    ----------------------------------------------------------------------
    | Step 2: Find Files
    ----------------------------------------------------------------------
    |
    | Only return files belonging to this project.
    |
    */

    let files = await ProjectFile.find({
        project: projectId,
    })
        .sort({ path: 1 });


    /*
    ----------------------------------------------------------------------
    | Step 3: Create Starter Files
    ----------------------------------------------------------------------
    |
    | Your existing project was created before we introduced
    | ProjectFile.
    |
    | Therefore, an old project may have ZERO files.
    |
    | To make the existing project immediately usable,
    | we create a few starter files the first time they are requested.
    |
    ----------------------------------------------------------------------
    */

    if (files.length === 0) {

        const starterFiles = [
            {
                project: projectId,
                path: "README.md",
                content:
                    "# DevPilot AI\n\nAI Powered Developer Assistant",
            },

            {
                project: projectId,
                path: "package.json",
                content:
                    '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
            },

            {
                project: projectId,
                path: "src/App.jsx",
                content:
                    'import React from "react";\n\nfunction App() {\n    return <h1>Hello DevPilot AI</h1>;\n}\n\nexport default App;',
            },

            {
                project: projectId,
                path: "src/main.jsx",
                content:
                    'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App.jsx";\n\nReactDOM.createRoot(document.getElementById("root")).render(\n    <App />\n);',
            },

            {
                project: projectId,
                path: "src/components",
                content:
                    "// Components folder",
            },
        ];


        /*
        Insert the starter files into MongoDB.
        */

        files = await ProjectFile.insertMany(
            starterFiles
        );
    }


    /*
    ------------a----------------------------------------------------------
    | Return Files
    ----------------------------------------------------------------------
    */

    return files;
};