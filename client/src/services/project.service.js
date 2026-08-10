/*
|--------------------------------------------------------------------------
| File        : project.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| -------
| This file contains all frontend API requests related to projects.
|
| React components should not contain the actual fetch() logic.
|
| Instead:
|
| Dashboard
|     ↓
| project.service.js
|     ↓
| Express API
|     ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

const API_URL = "http://localhost:5000/api/projects";


/*
|--------------------------------------------------------------------------
| Authentication Headers
|--------------------------------------------------------------------------
|
| Our project API is protected by JWT authentication.
|
| The JWT was stored in localStorage after successful login.
|
| We retrieve it here and send it to Express using:
|
| Authorization: Bearer <JWT>
|
|--------------------------------------------------------------------------
*/

const getAuthHeaders = () => {

    // Get the JWT saved by AuthContext after login.
    const token = localStorage.getItem("token");

    return {

        // Tell Express that we are sending JSON.
        "Content-Type": "application/json",

        // Send the JWT to the authentication middleware.
        Authorization: `Bearer ${token}`,
    };
};


/*
|--------------------------------------------------------------------------
| Get My Projects
|--------------------------------------------------------------------------
|
| GET /api/projects
|
| Returns all projects belonging to the authenticated user.
|
|--------------------------------------------------------------------------
*/

export const getProjects = async () => {

    /*
    Send GET request to the backend.
    */

    const response = await fetch(API_URL, {

        method: "GET",

        /*
        Include JWT authentication.
        */

        headers: getAuthHeaders(),
    });


    /*
    Convert backend JSON into a JavaScript object.
    */

    const data = await response.json();


    /*
    If the backend returns an error status,
    throw an error so Dashboard can handle it.
    */

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to fetch projects"
        );
    }


    /*
    Our backend returns:

    {
        success: true,
        projects: [...]
    }

    Return only the projects array.
    */

    return data.projects || [];
};


/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| POST /api/projects
|
| Creates a new project for the authenticated user.
|
|--------------------------------------------------------------------------
*/

export const createProject = async ({
    name,
    description,
}) => {

    /*
    Send project data to the backend.
    */

    const response = await fetch(API_URL, {

        method: "POST",

        /*
        Include JSON content type and JWT.
        */

        headers: getAuthHeaders(),

        /*
        Convert JavaScript object into JSON.
        */

        body: JSON.stringify({
            name,
            description,
        }),
    });


    /*
    Read backend response.
    */

    const data = await response.json();


    /*
    Handle backend errors.
    */

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to create project"
        );
    }


    /*
    Backend returns:

    {
        success: true,
        message: "...",
        project: {...}
    }

    Return the newly created project.
    */

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

export const getProjectById = async (projectId) => {

    /*
    Add the project ID to the API URL.
    */

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {

            method: "GET",

            headers: getAuthHeaders(),
        }
    );


    /*
    Convert response to JavaScript.
    */

    const data = await response.json();


    /*
    Handle errors.
    */

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to fetch project"
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

    /*
    Send updated project information.
    */

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {

            method: "PUT",

            headers: getAuthHeaders(),

            body: JSON.stringify(projectData),
        }
    );


    /*
    Read backend response.
    */

    const data = await response.json();


    /*
    Handle errors.
    */

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to update project"
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

export const deleteProject = async (projectId) => {

    /*
    Send delete request.
    */

    const response = await fetch(
        `${API_URL}/${projectId}`,
        {

            method: "DELETE",

            headers: getAuthHeaders(),
        }
    );


    /*
    Read backend response.
    */

    const data = await response.json();


    /*
    Handle errors.
    */

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to delete project"
        );
    }


    return data;
};