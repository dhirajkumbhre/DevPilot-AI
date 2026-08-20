import React, { useEffect, useState } from "react";

import ProjectWorkspace from "./ProjectWorkspace";

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
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

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
                    `http://localhost:5000/api/projects/${projectId}`,
                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization: `Bearer ${token}`,
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
    | Open Workspace
    |--------------------------------------------------------------------------
    */

    const handleOpenWorkspace = () => {
        setWorkspaceOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Workspace
    |--------------------------------------------------------------------------
    */

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
            <div style={styles.page}>
                <div style={styles.card}>
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
            <div style={styles.page}>
                <div style={styles.card}>
                    <h2>
                        ⚠️ Project Error
                    </h2>

                    <p>{error}</p>

                    <button
                        onClick={() => {
                            if (
                                typeof onBack ===
                                "function"
                            ) {
                                onBack();
                            } else {
                                window.history.back();
                            }
                        }}
                        style={styles.backButton}
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
            <div style={styles.page}>
                <div style={styles.card}>
                    <h2>
                        Project not found
                    </h2>

                    <button
                        onClick={() => {
                            if (
                                typeof onBack ===
                                "function"
                            ) {
                                onBack();
                            } else {
                                window.history.back();
                            }
                        }}
                        style={styles.backButton}
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
    |
    | When workspaceOpen is true we show the editor.
    |
    |--------------------------------------------------------------------------
    */

    if (workspaceOpen) {
        return (
            <ProjectWorkspace
                project={project}
                onBack={
                    handleCloseWorkspace
                }
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Project Details Page
    |--------------------------------------------------------------------------
    */

    return (
        <div style={styles.page}>

            <div style={styles.topBar}>

                <button
                    onClick={() => {
                        if (
                            typeof onBack ===
                            "function"
                        ) {
                            onBack();
                        } else {
                            window.history.back();
                        }
                    }}
                    style={styles.backButton}
                >
                    ← Back
                </button>

                <div style={styles.brand}>
                    DevPilot AI
                </div>
            </div>

            <div style={styles.projectCard}>

                <h1>
                    🧑🏽‍💻 {project.name}
                </h1>

                <p style={styles.description}>
                    {project.description ||
                        "No description provided."}
                </p>

                <div
                    style={
                        styles.infoSection
                    }
                >
                    <h2>
                        📋 Project Information
                    </h2>

                    <p>
                        <strong>
                            Project ID:
                        </strong>{" "}
                        {project._id}
                    </p>

                    <p>
                        <strong>
                            Owner:
                        </strong>{" "}
                        {project.owner}
                    </p>

                    <p>
                        <strong>
                            Created:
                        </strong>{" "}
                        {project.createdAt
                            ? new Date(
                                  project.createdAt
                              ).toLocaleString()
                            : "N/A"}
                    </p>

                    <p>
                        <strong>
                            Last Updated:
                        </strong>{" "}
                        {project.updatedAt
                            ? new Date(
                                  project.updatedAt
                              ).toLocaleString()
                            : "N/A"}
                    </p>
                </div>

                <button
                    onClick={
                        handleOpenWorkspace
                    }
                    style={
                        styles.openButton
                    }
                >
                     Open Project
                </button>
            </div>
        </div>
    );
};

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily:
            "Arial, Helvetica, sans-serif",
    },

    topBar: {
        maxWidth: "1000px",
        margin: "0 auto 20px",
        padding: "15px 20px",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },

    brand: {
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: "18px",
    },

    card: {
        maxWidth: "700px",
        margin: "100px auto",
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
    },

    projectCard: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "35px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #ddd",
        boxSizing: "border-box",
    },

    projectCardTitle: {
        marginTop: 0,
    },

    description: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "30px",
    },


    infoSection: {
    padding: "25px",
    marginBottom: "30px",
    marginTop: 0,
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #ddd",
},


    backButton: {
        padding: "9px 16px",
        border: "1px solid #aaa",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        fontSize: "14px",
    },

    openButton: {
        padding: "12px 22px",
        border: "none",
        borderRadius: "7px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },
};

export default ProjectDetails;