/*
|--------------------------------------------------------------------------
| File        : projectFile.model.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Stores files that belong to a DevPilot AI project.
|
| Example:
|
| Project
|   └── Chicken
|
| Files
|   ├── README.md
|   ├── package.json
|   ├── src/App.jsx
|   └── src/main.jsx
|
|--------------------------------------------------------------------------
*/

import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Project File Schema
|--------------------------------------------------------------------------
|
| Every file belongs to one project.
|
| The "path" field tells us where the file exists inside
| the project workspace.
|
| Example:
|
| README.md
| src/App.jsx
| src/components/Navbar.jsx
|
|--------------------------------------------------------------------------
*/

const projectFileSchema = new mongoose.Schema(
    {
        /*
        --------------------------------------------------------------
        | Project Reference
        --------------------------------------------------------------
        |
        | This connects the file to a Project document.
        |
        --------------------------------------------------------------
        */

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        /*
        --------------------------------------------------------------
        | File Path
        --------------------------------------------------------------
        |
        | Stores the location/name of the file.
        |
        | Examples:
        |
        | README.md
        | package.json
        | src/App.jsx
        |
        --------------------------------------------------------------
        */

        path: {
            type: String,
            required: true,
            trim: true,
        },

        /*
        --------------------------------------------------------------
        | File Content
        --------------------------------------------------------------
        |
        | This is the actual code/text inside the file.
        |
        | Example:
        |
        | import React from "react";
        |
        --------------------------------------------------------------
        */

        content: {
            type: String,
            default: "",
        },
    },
    {
        /*
        Automatically creates:
        createdAt
        updatedAt
        */

        timestamps: true,
    }
);

/*
|--------------------------------------------------------------------------
| Prevent Duplicate File Paths
|--------------------------------------------------------------------------
|
| A project should not contain two files with the same path.
|
| Example:
|
| Project A:
|   src/App.jsx       ← allowed
|
| Project A:
|   src/App.jsx       ← NOT allowed
|
|--------------------------------------------------------------------------
*/

projectFileSchema.index(
    {
        project: 1,
        path: 1,
    },
    {
        unique: true,
    }
);

/*
|--------------------------------------------------------------------------
| Create Model
|--------------------------------------------------------------------------
*/

const ProjectFile = mongoose.model(
    "ProjectFile",
    projectFileSchema
);

export default ProjectFile;