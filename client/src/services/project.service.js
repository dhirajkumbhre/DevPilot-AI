/*
|--------------------------------------------------------------------------
| File        : project.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Contains all frontend API requests related to projects.
|
| React components should not contain fetch() logic.
|
| React Component
|       ↓
| project.service.js
|       ↓
| Express API
|       ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

const API_URL =
    "http://localhost:5000/api/projects";


/*
|--------------------------------------------------------------------------
| Authentication Headers
|--------------------------------------------------------------------------
|
| Gets the JWT from localStorage and sends it to the backend.
|
|--------------------------------------------------------------------------
*/

const getAuthHeaders = () => {

    const token =
        localStorage.getItem("token");

    return {

        "Content-Type":
            "application/json",

        Authorization:
            `Bearer ${token}`,
    };
};


/*
|--------------------------------------------------------------------------
| Get My Projects
|--------------------------------------------------------------------------
|
| GET /api/projects
|
|--------------------------------------------------------------------------
*/

export const getProjects = async () => {

    const response = await fetch(
        API_URL,
        {
            method: "GET",

            headers:
                getAuthHeaders(),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch projects"
        );
    }


    return data.projects || [];
};


/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| POST /api/projects
|
|--------------------------------------------------------------------------
*/

export const createProject = async ({
    name,
    description,
}) => {

    const response = await fetch(
        API_URL,
        {
            method: "POST",

            headers:
                getAuthHeaders(),

            body:
                JSON.stringify({
                    name,
                    description,
                }),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to create project"
        );
    }


    return data.project;
};


/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
|
| GET /api/projects/:id
|
|--------------------------------------------------------------------------
*/

export const getProjectById = async (
    projectId
) => {

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {
            method: "GET",

            headers:
                getAuthHeaders(),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch project"
        );
    }


    return data.project;
};


/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
|
| PUT /api/projects/:id
|
|--------------------------------------------------------------------------
*/

export const updateProject = async (
    projectId,
    projectData
) => {

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {
            method: "PUT",

            headers:
                getAuthHeaders(),

            body:
                JSON.stringify(
                    projectData
                ),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to update project"
        );
    }


    return data.project;
};


/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
|
| DELETE /api/projects/:id
|
|--------------------------------------------------------------------------
*/

export const deleteProject = async (
    projectId
) => {

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {
            method: "DELETE",

            headers:
                getAuthHeaders(),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to delete project"
        );
    }


    return data;
};


/*
|--------------------------------------------------------------------------
| Get Project Files
|--------------------------------------------------------------------------
|
| GET /api/projects/:id/files
|
|--------------------------------------------------------------------------
*/

export const getProjectFiles = async (
    projectId
) => {

    const response = await fetch(
        `${API_URL}/${projectId}/files`,
        {
            method: "GET",

            headers:
                getAuthHeaders(),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch project files"
        );
    }


    return data.files || [];
};


/*
|--------------------------------------------------------------------------
| Update Project File
|--------------------------------------------------------------------------
|
| PUT /api/projects/:id/files/:fileId
|
| This is the IMPORTANT function for our Save File button.
|
|--------------------------------------------------------------------------
*/

export const updateProjectFile = async (
    projectId,
    fileId,
    content
) => {

    const response = await fetch(
        `${API_URL}/${projectId}/files/${fileId}`,
        {
            method: "PUT",

            headers:
                getAuthHeaders(),

            body:
                JSON.stringify({
                    content,
                }),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to save project file"
        );
    }


    return data.file;
};