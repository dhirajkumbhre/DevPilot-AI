/*
|--------------------------------------------------------------------------
| File        : ProjectDetails.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| --------
| Displays information about one selected project.
|
| Flow:
|
| Dashboard
|     ↓
| Project ID
|     ↓
| ProjectDetails
|     ↓
| project.service.js
|     ↓
| Express API
|     ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| Project Service
|--------------------------------------------------------------------------
|
| getProjectById() handles the actual API request.
|
| We keep fetch() logic inside project.service.js instead
| of writing it directly inside this component.
|
|--------------------------------------------------------------------------
*/

import { getProjectById } from "../services/project.service.js";


import ProjectWorkspace from "./ProjectWorkspace.jsx";
/*
|--------------------------------------------------------------------------
| ProjectDetails Component
|--------------------------------------------------------------------------
|
| projectId comes from Dashboard.
|
| Example:
|
| <ProjectDetails projectId="65abc123" />
|
|--------------------------------------------------------------------------
*/

const ProjectDetails = ({ projectId, onBack }) => {

    /*
    |--------------------------------------------------------------------------
    | Project State
    |--------------------------------------------------------------------------
    |
    | Stores the project received from our backend.
    |
    |--------------------------------------------------------------------------
    */

    const [project, setProject] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Fetch Project
    |--------------------------------------------------------------------------
    |
    | This runs whenever projectId changes.
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        /*
        |----------------------------------------------------------------------
        | Create async function
        |----------------------------------------------------------------------
        |
        | useEffect itself should not be async.
        |
        | Therefore we create an async function inside it.
        |
        |----------------------------------------------------------------------
        */

        const fetchProject = async () => {

            try {

                /*
                Start loading.
                */

                setLoading(true);

                /*
                Clear any previous error.
                */

                setError("");


                /*
                Call our frontend API service.
                */

                const data = await getProjectById(projectId);


                /*
                Store the project returned by backend.
                */

                setProject(data);

            } catch (err) {

                /*
                Log the real error for development.
                */

                console.error(
                    "Failed to fetch project:",
                    err
                );


                /*
                Show a friendly error to the user.
                */

                setError(
                    err.message || "Failed to load project"
                );

            } finally {

                /*
                Loading is finished whether the request
                succeeded or failed.
                */

                setLoading(false);

            }

        };


        /*
        Execute the function.
        */

        fetchProject();

    }, [projectId]);


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div style={styles.container}>

                <button onClick={onBack}>
                    ← Back to Dashboard
                </button>

                <h2>
                    Loading project...
                </h2>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error Screen
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div style={styles.container}>

                <button onClick={onBack}>
                    ← Back to Dashboard
                </button>

                <h2>
                    🔴 Unable to Load Project
                </h2>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Project Not Found
    |--------------------------------------------------------------------------
    */

    if (!project) {

        return (

            <div style={styles.container}>

                <button onClick={onBack}>
                    ← Back to Dashboard
                </button>

                <h2>
                    Project not found
                </h2>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Project Details Screen
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.container}>

            {/* ----------------------------------------------------------
                Back Button
            ---------------------------------------------------------- */}

            <button
                onClick={onBack}
                style={styles.backButton}
            >
                ← Back to Dashboard
            </button>


            {/* ----------------------------------------------------------
                Project Header
            ---------------------------------------------------------- */}

            <div style={styles.header}>

                <h1>
                    🚀 {project.name}
                </h1>

                <p>
                    {project.description || "No description provided."}
                </p>

            </div>


            {/* ----------------------------------------------------------
                Project Information
            ---------------------------------------------------------- */}

            <div style={styles.card}>

                <h2>
                    📋 Project Information
                </h2>

                <p>
                    <strong>Project ID:</strong>{" "}
                    {project.id || project._id}
                </p>

                <p>
                    <strong>Owner:</strong>{" "}
                    {project.owner}
                </p>

                <p>
                    <strong>Created:</strong>{" "}
                    {project.createdAt
                        ? new Date(project.createdAt).toLocaleString()
                        : "N/A"}
                </p>

                <p>
                    <strong>Last Updated:</strong>{" "}
                    {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleString()
                        : "N/A"}
                </p>

            </div>


            {/* ----------------------------------------------------------
                Developer Workspace Placeholder
            ----------------------------------------------------------
            
            This section is intentionally simple for now.

            Later this will become the actual DevPilot AI
            developer workspace.

            We will eventually add:

            • File explorer
            • Code editor
            • AI assistant
            • Git integration
            • Code analysis
            • AI code generation

            ---------------------------------------------------------- */}

            {/* ----------------------------------------------------------
    Developer Workspace
---------------------------------------------------------- */}

<ProjectWorkspace
    project={project}
    onBack={() => {
        /*
        Return to Project Details.
        */

        // This will be connected properly in the next step.
        console.log("Back to project details");
    }}
/>





        </div>

    );

};


/*
|--------------------------------------------------------------------------
| Temporary Styles
|--------------------------------------------------------------------------
|
| We are keeping styles inside the component for now.
|
| Later we will move to proper CSS/Tailwind styling.
|
|--------------------------------------------------------------------------
*/

const styles = {

    container: {

        maxWidth: "900px",

        margin: "40px auto",

        padding: "20px",

        fontFamily: "Arial, sans-serif",

    },


    backButton: {

        padding: "8px 14px",

        marginBottom: "20px",

        cursor: "pointer",

    },


    header: {

        padding: "25px",

        marginBottom: "20px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        backgroundColor: "#ffffff",

    },


    card: {

        padding: "25px",

        marginBottom: "20px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        backgroundColor: "#ffffff",

    },

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default ProjectDetails;