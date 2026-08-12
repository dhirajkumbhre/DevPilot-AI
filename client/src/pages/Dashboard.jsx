import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../services/project.service.js";

import ProjectDetails from "./ProjectDetails.jsx";

import "../styles/dashboard.css";


const Dashboard = () => {

    const {
        user,
        logout,
    } = useAuth();


    // ---------------------------------------------------------
    // PROJECT STATE
    // ---------------------------------------------------------

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [
        selectedProjectId,
        setSelectedProjectId
    ] = useState(null);


    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] =
        useState(false);


    // ---------------------------------------------------------
    // EDIT PROJECT
    // ---------------------------------------------------------

    const [
        editingProjectId,
        setEditingProjectId
    ] = useState(null);

    const [editName, setEditName] = useState("");

    const [
        editDescription,
        setEditDescription
    ] = useState("");


    // ---------------------------------------------------------
    // LOAD PROJECTS
    // ---------------------------------------------------------

    useEffect(() => {

        const loadProjects = async () => {

            try {

                setLoading(true);

                setError("");

                const data = await getProjects();

                setProjects(data);

            } catch (err) {

                console.error(
                    "Failed to fetch projects:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load projects."
                );

            } finally {

                setLoading(false);

            }

        };


        loadProjects();

    }, []);


    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    const handleCreateProject = async (event) => {

        event.preventDefault();


        if (!name.trim()) {

            setError(
                "Project name is required."
            );

            return;
        }


        try {

            setCreating(true);

            setError("");


            await createProject({

                name: name.trim(),

                description:
                    description.trim(),

            });


            setName("");

            setDescription("");

            setShowCreateForm(false);


            const updatedProjects =
                await getProjects();


            setProjects(updatedProjects);


        } catch (err) {

            console.error(
                "Create project failed:",
                err
            );

            setError(
                err.message ||
                "Failed to create project."
            );

        } finally {

            setCreating(false);

        }

    };


    // ---------------------------------------------------------
    // START EDIT
    // ---------------------------------------------------------

    const handleStartEdit = (project) => {

        setEditingProjectId(
            project._id
        );

        setEditName(
            project.name
        );

        setEditDescription(
            project.description || ""
        );

        setError("");

    };


    // ---------------------------------------------------------
    // CANCEL EDIT
    // ---------------------------------------------------------

    const handleCancelEdit = () => {

        setEditingProjectId(null);

        setEditName("");

        setEditDescription("");

        setError("");

    };


    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    const handleUpdateProject = async (event) => {

        event.preventDefault();


        if (!editName.trim()) {

            setError(
                "Project name is required."
            );

            return;
        }


        try {

            setError("");


            await updateProject(

                editingProjectId,

                {
                    name:
                        editName.trim(),

                    description:
                        editDescription.trim(),
                }

            );


            handleCancelEdit();


            const updatedProjects =
                await getProjects();


            setProjects(updatedProjects);


        } catch (err) {

            console.error(
                "Update project failed:",
                err
            );

            setError(
                err.message ||
                "Failed to update project."
            );

        }

    };


    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    const handleDeleteProject = async (
        projectId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this project?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");


            await deleteProject(
                projectId
            );


            setProjects(
                (currentProjects) =>
                    currentProjects.filter(
                        (project) =>
                            project._id !==
                            projectId
                    )
            );


        } catch (err) {

            console.error(
                "Delete project failed:",
                err
            );

            setError(
                err.message ||
                "Failed to delete project."
            );

        }

    };


    // ---------------------------------------------------------
    // OPEN PROJECT
    // ---------------------------------------------------------

    if (selectedProjectId) {

        return (

            <ProjectDetails

                projectId={
                    selectedProjectId
                }

                onBack={() => {

                    setSelectedProjectId(
                        null
                    );

                }}

            />

        );

    }


    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="loading-screen">

                    <div className="loading-logo">
                        🚀
                    </div>

                    <h2>
                        Loading your workspace
                    </h2>

                    <p>
                        Connecting to your projects...
                    </p>

                </div>

            </div>

        );

    }


    // ---------------------------------------------------------
    // DASHBOARD
    // ---------------------------------------------------------

    return (

        <div className="dashboard-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="dashboard-navbar">

                <div className="nav-brand">

                    <div className="brand-icon">
                        🚀
                    </div>

                    <div>

                        <div className="brand-name">
                            DevPilot AI
                        </div>

                        <div className="brand-subtitle">
                            Developer Workspace
                        </div>

                    </div>

                </div>


                <div className="nav-right">

                    <div className="system-status">

                        <span className="status-dot"></span>

                        System Operational

                    </div>


                    <div className="user-menu">

                        <div className="user-avatar">

                            {
                                user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                    || "D"
                            }

                        </div>

                        <div className="user-info">

                            <span className="user-name">

                                {
                                    user?.name ||
                                    "Developer"
                                }

                            </span>

                            <span className="user-role">
                                Developer
                            </span>

                        </div>

                    </div>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="dashboard-content">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="dashboard-hero">

                    <div>

                        <div className="hero-eyebrow">
                            DEVELOPER WORKSPACE
                        </div>

                        <h1>

                            Welcome back,{" "}

                            {
                                user?.name ||
                                "Developer"
                            }

                            <span> 👋</span>

                        </h1>

                        <p>
                            Build, manage and organize your
                            development projects in one place.
                        </p>

                    </div>


                    <button
                        className="hero-create-button"
                        onClick={() =>
                            setShowCreateForm(true)
                        }
                    >

                        <span>+</span>

                        New Project

                    </button>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="dashboard-error">

                        <span>!</span>

                        <div>

                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    STATS
                ================================================= */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <div className="stat-icon blue">
                            📁
                        </div>

                        <div>

                            <span className="stat-label">
                                Total Projects
                            </span>

                            <strong className="stat-value">
                                {projects.length}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>

                            <span className="stat-label">
                                System Status
                            </span>

                            <strong className="stat-value small">
                                Operational
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon purple">
                            ⚡
                        </div>

                        <div>

                            <span className="stat-label">
                                Workspace
                            </span>

                            <strong className="stat-value small">
                                DevPilot AI
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    CREATE PROJECT
                ================================================= */}

                {showCreateForm && (

                    <section className="create-project-card">

                        <div className="section-heading">

                            <div>

                                <div className="section-icon">
                                    ✦
                                </div>

                                <div>

                                    <h2>
                                        Create a new project
                                    </h2>

                                    <p>
                                        Start a new workspace for
                                        your development project.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="close-button"
                                onClick={() => {

                                    setShowCreateForm(
                                        false
                                    );

                                    setError("");

                                }}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="project-form"
                            onSubmit={
                                handleCreateProject
                            }
                        >

                            <div className="form-field">

                                <label>
                                    Project name
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. E-Commerce Platform"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="What are you building?"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {

                                        setShowCreateForm(
                                            false
                                        );

                                        setName("");

                                        setDescription("");

                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={creating}
                                >

                                    {creating
                                        ? "Creating..."
                                        : "Create Project →"
                                    }

                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* =================================================
                    PROJECTS
                ================================================= */}

                <section className="projects-section">


                    <div className="projects-heading">

                        <div>

                            <div className="section-title-row">

                                <div className="section-icon purple">
                                    ◈
                                </div>

                                <h2>
                                    Your Projects
                                </h2>

                                <span className="project-count">
                                    {projects.length}
                                </span>

                            </div>

                            <p>
                                Your development workspaces
                            </p>

                        </div>


                        {!showCreateForm && (

                            <button
                                className="small-create-button"
                                onClick={() =>
                                    setShowCreateForm(
                                        true
                                    )
                                }
                            >
                                + New Project
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {projects.length === 0 ? (

                        <div className="empty-projects">

                            <div className="empty-icon">
                                📁
                            </div>

                            <h3>
                                No projects yet
                            </h3>

                            <p>
                                Create your first project and
                                start building with DevPilot AI.
                            </p>

                            <button
                                onClick={() =>
                                    setShowCreateForm(
                                        true
                                    )
                                }
                                className="submit-button"
                            >
                                Create your first project →
                            </button>

                        </div>

                    ) : (

                        <div className="projects-grid">

                            {projects.map(
                                (project) => (

                                    <div
                                        key={
                                            project._id
                                        }
                                        className="project-card"
                                    >


                                        {/* EDIT MODE */}

                                        {editingProjectId ===
                                        project._id ? (

                                            <form
                                                className="edit-form"
                                                onSubmit={
                                                    handleUpdateProject
                                                }
                                            >

                                                <div className="edit-header">

                                                    <span>
                                                        Edit Project
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        ×
                                                    </button>

                                                </div>


                                                <input
                                                    type="text"
                                                    value={
                                                        editName
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            setEditName(
                                                                event.target.value
                                                            )
                                                    }
                                                />


                                                <textarea
                                                    value={
                                                        editDescription
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            setEditDescription(
                                                                event.target.value
                                                            )
                                                    }
                                                />


                                                <div className="edit-actions">

                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="submit-button"
                                                    >
                                                        Save Changes
                                                    </button>

                                                </div>

                                            </form>

                                        ) : (

                                            /* =================================================
                                               NORMAL PROJECT
                                            ================================================= */

                                            <>

                                                <div className="project-card-top">

                                                    <div className="project-folder">
                                                        📁
                                                    </div>


                                                    <div className="project-menu">

                                                        <span className="project-status">
                                                            Active
                                                        </span>

                                                    </div>

                                                </div>


                                                <h3>
                                                    {
                                                        project.name
                                                    }
                                                </h3>


                                                <p className="project-description">

                                                    {
                                                        project.description ||
                                                        "No description provided."
                                                    }

                                                </p>


                                                <div className="project-meta">

                                                    <span>
                                                        Dev workspace
                                                    </span>

                                                </div>


                                                <div className="project-actions">

                                                    <button
                                                        className="open-project-button"
                                                        onClick={() =>
                                                            setSelectedProjectId(
                                                                project._id
                                                            )
                                                        }
                                                    >
                                                        Open Project
                                                        <span>→</span>
                                                    </button>


                                                    <button
                                                        className="icon-action edit"
                                                        onClick={() =>
                                                            handleStartEdit(
                                                                project
                                                            )
                                                        }
                                                        title="Edit project"
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className="icon-action delete"
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                project._id
                                                            )
                                                        }
                                                        title="Delete project"
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            </>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="dashboard-footer">

                    <div>
                        🚀 DevPilot AI
                    </div>

                    <span>
                        AI-powered developer workspace
                    </span>

                    <span>
                        v1.0
                    </span>

                </footer>


            </main>

        </div>

    );

};


export default Dashboard;