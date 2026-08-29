import React, { useEffect, useState } from "react";

import ProjectWorkspace from "./ProjectWorkspace";

import "../styles/project-details.css";


/*
|--------------------------------------------------------------------------
| ProjectDetails
|--------------------------------------------------------------------------
|
| Displays information about a single project.
|
| It also opens the ProjectWorkspace.
|
|--------------------------------------------------------------------------
*/

const ProjectDetails = ({ projectId, onBack }) => {

    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [workspaceOpen, setWorkspaceOpen] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Project
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadProject = async () => {

            try {

                setLoading(true);

                setError("");

                const token =
                    localStorage.getItem("token");


const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
    {
        method: "GET",

        headers: {
            "Content-Type":
                "application/json",

            Authorization:
                `Bearer ${token}`,
        },
    }
);


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load project"
                    );

                }


                setProject(data.project);

            } catch (err) {

                console.error(
                    "Failed to load project:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load project"
                );

            } finally {

                setLoading(false);

            }

        };


        if (projectId) {
            loadProject();
        }

    }, [projectId]);


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        if (typeof onBack === "function") {

            onBack();

        } else {

            window.history.back();

        }

    };


    const handleOpenWorkspace = () => {

        setWorkspaceOpen(true);

    };


    const handleCloseWorkspace = () => {

        setWorkspaceOpen(false);

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="project-details-page">

                <div className="project-details-state">

                    <h2>
                        Loading project...
                    </h2>

                </div>

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (
            <div className="project-details-page">

                <div className="project-details-state">

                    <h2>
                        Project Error
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={handleBack}
                        className="project-details-back"
                    >
                        ← Back
                    </button>

                </div>

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
            <div className="project-details-page">

                <div className="project-details-state">

                    <h2>
                        Project not found
                    </h2>

                    <button
                        onClick={handleBack}
                        className="project-details-back"
                    >
                        ← Back
                    </button>

                </div>

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Workspace
    |--------------------------------------------------------------------------
    */

    if (workspaceOpen) {

        return (
            <ProjectWorkspace
                project={project}
                onBack={handleCloseWorkspace}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Project Details Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="project-details-page">

            {/* Top navigation */}

            <div className="project-details-topbar">

                <button
                    onClick={handleBack}
                    className="project-details-back"
                >
                    ← Back
                </button>


                <div className="project-details-brand">
                    DevPilot AI
                </div>

            </div>


            {/* Main project card */}

            <main className="project-details-card">

                {/* Project header */}

                <div className="project-details-header">

                    <div className="project-details-title-area">

                        <h1 className="project-details-title">
                            {project.name}
                        </h1>

                        <p className="project-details-description">
                            {project.description ||
                                "No description provided."}
                        </p>

                    </div>


                    <div className="project-details-status">

                        <span className="project-details-status-dot" />

                        Active

                    </div>

                </div>


                {/* Project metadata */}

                <div className="project-details-info-grid">

                    <div className="project-details-info-item">

                        <div className="project-details-info-label">
                            Project ID
                        </div>

                        <div className="project-details-info-value">
                            {project._id}
                        </div>

                    </div>


                    <div className="project-details-info-item">

                        <div className="project-details-info-label">
                            Owner
                        </div>

                        <div className="project-details-info-value">
                            {project.owner}
                        </div>

                    </div>


                    <div className="project-details-info-item">

                        <div className="project-details-info-label">
                            Created
                        </div>

                        <div className="project-details-info-value">

                            {project.createdAt
                                ? new Date(
                                    project.createdAt
                                ).toLocaleString()
                                : "N/A"}

                        </div>

                    </div>


                    <div className="project-details-info-item">

                        <div className="project-details-info-label">
                            Last Updated
                        </div>

                        <div className="project-details-info-value">

                            {project.updatedAt
                                ? new Date(
                                    project.updatedAt
                                ).toLocaleString()
                                : "N/A"}

                        </div>

                    </div>

                </div>


                {/* Project description */}

                <section className="project-details-section">

                    <h2 className="project-details-section-title">
                        About this workspace
                    </h2>

                    <p className="project-details-section-text">

                        This workspace contains the files,
                        configuration and development tools
                        associated with this project.

                    </p>

                </section>


                {/* Workspace action */}

                <section className="project-details-workspace">

                    <div>

                        <h2 className="project-details-workspace-title">
                            Development workspace
                        </h2>

                        <p className="project-details-workspace-text">
                            Open the project editor to manage
                            files and work with DevPilot.
                        </p>

                    </div>


                    <button
                        onClick={handleOpenWorkspace}
                        className="project-details-open"
                    >
                        Open Workspace →
                    </button>

                </section>

            </main>

        </div>

    );

};


export default ProjectDetails;