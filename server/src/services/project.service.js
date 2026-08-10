/*
|--------------------------------------------------------------------------
| File        : project.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Contains the business logic for Project operations.
|
| This file handles:
|
| 1. Create Project
| 2. Get User Projects
| 3. Get Single Project
| 4. Update Project
| 5. Delete Project
| 6. Get Project Files
| 7. Update Project File
|
|--------------------------------------------------------------------------
*/

import Project from "../models/project.model.js";
import ProjectFile from "../models/projectFile.model.js";

/*
|--------------------------------------------------------------------------
| Create Project
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
        owner: userId,
    });

    return project;
};


/*
|--------------------------------------------------------------------------
| Get User Projects
|--------------------------------------------------------------------------
|
| Returns only projects belonging to the authenticated user.
|
|--------------------------------------------------------------------------
*/

export const getUserProjectsService = async (userId) => {

    const projects = await Project.find({
        owner: userId,
    }).sort({
        createdAt: -1,
    });

    return projects;
};


/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
|
| Finds one project belonging to the authenticated user.
|
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
| GET /api/projects/:id/files
|
| Before returning files we verify that the project belongs
| to the authenticated user.
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

    if (!project) {
        throw new Error("Project not found");
    }


    /*
    ----------------------------------------------------------------------
    | Step 2: Find Existing Files
    ----------------------------------------------------------------------
    */

    let files = await ProjectFile.find({
        project: projectId,
    }).sort({
        path: 1,
    });


    /*
    ----------------------------------------------------------------------
    | Step 3: Create Starter Files
    ----------------------------------------------------------------------
    |
    | This is useful for older projects that were created before
    | ProjectFile was introduced.
    |
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


        files = await ProjectFile.insertMany(
            starterFiles
        );
    }


    return files;
};


/*
|--------------------------------------------------------------------------
| Update Project File
|--------------------------------------------------------------------------
|
| PUT /api/projects/:id/files/:fileId
|
| Saves edited file content into MongoDB.
|
|--------------------------------------------------------------------------
*/

export const updateProjectFileService = async ({
    projectId,
    fileId,
    userId,
    content,
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

    if (!project) {
        throw new Error("Project not found");
    }


    /*
    ----------------------------------------------------------------------
    | Step 2: Find File
    ----------------------------------------------------------------------
    |
    | We check BOTH:
    |
    | file ID
    | +
    | project ID
    |
    | This prevents a user from modifying a file from another project.
    |
    */

    const file = await ProjectFile.findOneAndUpdate(
        {
            _id: fileId,
            project: projectId,
        },
        {
            content,
        },
        {
            new: true,
            runValidators: true,
        }
    );


    /*
    ----------------------------------------------------------------------
    | Step 3: File Not Found
    ----------------------------------------------------------------------
    */

    if (!file) {
        throw new Error("Project file not found");
    }


    /*
    ----------------------------------------------------------------------
    | Step 4: Return Updated File
    ----------------------------------------------------------------------
    */

    return file;
};