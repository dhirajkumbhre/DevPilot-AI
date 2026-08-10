/*
|--------------------------------------------------------------------------
| File        : Dashboard.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| --------
| Main dashboard shown after successful login.
|
| Responsibilities:
|
| 1. Display logged-in user.
| 2. Load user's projects.
| 3. Create projects.
| 4. Update projects.
| 5. Delete projects.
| 6. Open an individual project.
| 7. Logout.
|
|--------------------------------------------------------------------------
|
| Project flow:
|
| Dashboard
|     ↓
| Click "Open Project"
|     ↓
| selectedProjectId
|     ↓
| ProjectDetails.jsx
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
| Authentication Context
|--------------------------------------------------------------------------
*/

import { useAuth } from "../context/AuthContext.jsx";


/*
|--------------------------------------------------------------------------
| Project API Services
|--------------------------------------------------------------------------
|
| These functions contain our fetch() requests.
|
| Dashboard handles UI.
| project.service.js handles API communication.
|
|--------------------------------------------------------------------------
*/

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../services/project.service.js";


/*
|--------------------------------------------------------------------------
| Project Details Page
|--------------------------------------------------------------------------
|
| This component displays one selected project.
|
|--------------------------------------------------------------------------
*/

import ProjectDetails from "./ProjectDetails.jsx";


/*
|--------------------------------------------------------------------------
| Dashboard Component
|--------------------------------------------------------------------------
*/

const Dashboard = () => {


    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    |
    | user:
    |     Information about the logged-in user.
    |
    | logout:
    |     Removes the user's authentication.
    |
    |--------------------------------------------------------------------------
    */

    const {
        user,
        logout,
    } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Projects State
    |--------------------------------------------------------------------------
    |
    | Stores all projects belonging to the logged-in user.
    |
    |--------------------------------------------------------------------------
    */

    const [projects, setProjects] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    |
    | Used while loading projects from the backend.
    |
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    |
    | Stores errors that occur during API requests.
    |
    |--------------------------------------------------------------------------
    */

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Selected Project
    |--------------------------------------------------------------------------
    |
    | null:
    |     → Show Dashboard
    |
    | project ID:
    |     → Show ProjectDetails
    |
    |--------------------------------------------------------------------------
    */

    const [
        selectedProjectId,
        setSelectedProjectId
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Create Project Form
    |--------------------------------------------------------------------------
    */

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Edit Project State
    |--------------------------------------------------------------------------
    |
    | editingProjectId tells us which project is currently
    | being edited.
    |
    |--------------------------------------------------------------------------
    */

    const [
        editingProjectId,
        setEditingProjectId
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Edit Form State
    |--------------------------------------------------------------------------
    */

    const [editName, setEditName] = useState("");

    const [
        editDescription,
        setEditDescription
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Projects
    |--------------------------------------------------------------------------
    |
    | React's useEffect callback itself should NOT be async.
    |
    | Therefore we create an async function inside useEffect.
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {


        /*
        ----------------------------------------------------------------------
        | Async Project Loader
        ----------------------------------------------------------------------
        */

        const loadProjects = async () => {

            try {


                /*
                Show loading state.
                */

                setLoading(true);


                /*
                Clear previous errors.
                */

                setError("");


                /*
                Get projects from backend.
                */

                const data = await getProjects();


                /*
                Save projects into React state.
                */

                setProjects(data);


            } catch (err) {


                /*
                Log the real error for development.
                */

                console.error(
                    "Failed to fetch projects:",
                    err
                );


                /*
                Display friendly error.
                */

                setError(
                    err.message ||
                    "Failed to load projects"
                );


            } finally {


                /*
                Loading is finished.
                */

                setLoading(false);

            }

        };


        /*
        Execute the async function.
        */

        loadProjects();


    }, []);


    /*
    |--------------------------------------------------------------------------
    | Create Project
    |--------------------------------------------------------------------------
    |
    | Sends:
    |
    | POST /api/projects
    |
    |--------------------------------------------------------------------------
    */

    const handleCreateProject = async (event) => {


        /*
        Prevent browser from refreshing the page.
        */

        event.preventDefault();


        /*
        Basic validation.
        */

        if (!name.trim()) {

            setError(
                "Project name is required."
            );

            return;
        }


        try {


            setError("");


            /*
            Send project information to backend.
            */

            await createProject({

                name: name.trim(),

                description:
                    description.trim(),

            });


            /*
            Clear form after successful creation.
            */

            setName("");

            setDescription("");


            /*
            Get fresh project list from MongoDB.
            */

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
                "Failed to create project"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Start Editing Project
    |--------------------------------------------------------------------------
    */

    const handleStartEdit = (project) => {


        /*
        Remember which project is being edited.
        */

        setEditingProjectId(
            project._id
        );


        /*
        Put existing project data into edit form.
        */

        setEditName(
            project.name
        );


        setEditDescription(
            project.description || ""
        );


        /*
        Clear old errors.
        */

        setError("");

    };


    /*
    |--------------------------------------------------------------------------
    | Cancel Editing
    |--------------------------------------------------------------------------
    */

    const handleCancelEdit = () => {


        /*
        Leave edit mode.
        */

        setEditingProjectId(null);


        /*
        Clear edit form.
        */

        setEditName("");

        setEditDescription("");


        /*
        Clear errors.
        */

        setError("");

    };


    /*
    |--------------------------------------------------------------------------
    | Update Project
    |--------------------------------------------------------------------------
    |
    | Sends:
    |
    | PUT /api/projects/:id
    |
    |--------------------------------------------------------------------------
    */

    const handleUpdateProject = async (event) => {


        /*
        Prevent page refresh.
        */

        event.preventDefault();


        /*
        Project name is required.
        */

        if (!editName.trim()) {

            setError(
                "Project name is required."
            );

            return;
        }


        try {


            setError("");


            /*
            Update project in backend.
            */

            await updateProject(

                editingProjectId,

                {
                    name:
                        editName.trim(),

                    description:
                        editDescription.trim(),
                }

            );


            /*
            Exit edit mode.
            */

            handleCancelEdit();


            /*
            Reload project list.
            */

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
                "Failed to update project"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Delete Project
    |--------------------------------------------------------------------------
    |
    | Sends:
    |
    | DELETE /api/projects/:id
    |
    |--------------------------------------------------------------------------
    */

    const handleDeleteProject = async (projectId) => {


        /*
        Ask for confirmation before permanently
        deleting the project.
        */

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this project?"
            );


        /*
        User cancelled deletion.
        */

        if (!confirmed) {

            return;
        }


        try {


            setError("");


            /*
            Delete project from backend.
            */

            await deleteProject(
                projectId
            );


            /*
            Remove project from the current UI state.
            */

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
                "Failed to delete project"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        logout();

    };


    /*
    |--------------------------------------------------------------------------
    | Project Details View
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | If selectedProjectId exists,
    | we show ProjectDetails instead of Dashboard.
    |
    | Example:
    |
    | selectedProjectId = "65abc123"
    |
    |          ↓
    |
    | <ProjectDetails projectId="65abc123" />
    |
    |--------------------------------------------------------------------------
    */

    if (selectedProjectId) {


        return (

            <ProjectDetails

                /*
                Send selected project ID.
                */

                projectId={
                    selectedProjectId
                }


                /*
                Back button callback.
                */

                onBack={() => {

                    /*
                    Clear selected project.

                    null means:
                    "No project is currently open."

                    Dashboard will appear again.
                    */

                    setSelectedProjectId(
                        null
                    );

                }}

            />

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {


        return (

            <div
                style={
                    styles.page
                }
            >

                <div
                    style={
                        styles.card
                    }
                >

                    <h2>
                        Loading your projects...
                    </h2>

                    <p>
                        Connecting to DevPilot AI backend.
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Main Dashboard
    |--------------------------------------------------------------------------
    */

    return (

        <div
            style={
                styles.page
            }
        >


            {/* ----------------------------------------------------------
                Header
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.header
                }
            >

                <div>

                    <h1>
                        🚀 DevPilot AI
                    </h1>

                    <p>
                        AI Powered Developer Assistant
                    </p>

                </div>


                <button

                    onClick={
                        handleLogout
                    }

                    style={
                        styles.logoutButton
                    }

                >
                    Logout

                </button>

            </div>


            {/* ----------------------------------------------------------
                Welcome
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.card
                }
            >

                <h2>

                    Welcome,{" "}

                    {
                        user?.name ||
                        "Developer"
                    }

                    {" "}👋

                </h2>


                <p>
                    Your developer workspace is ready.
                </p>

            </div>


            {/* ----------------------------------------------------------
                Authentication
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.card
                }
            >

                <h2>
                    🔐 Authentication
                </h2>


                <p>
                    🟢 You are authenticated.
                </p>


                <p>
                    JWT status: Available
                </p>

            </div>


            {/* ----------------------------------------------------------
                Account
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.card
                }
            >

                <h2>
                    👤 Account
                </h2>


                <p>

                    <strong>
                        Name:
                    </strong>{" "}

                    {
                        user?.name ||
                        "N/A"
                    }

                </p>


                <p>

                    <strong>
                        Email:
                    </strong>{" "}

                    {
                        user?.email ||
                        "N/A"
                    }

                </p>

            </div>


            {/* ----------------------------------------------------------
                Error Message
            ---------------------------------------------------------- */}

            {error && (

                <div
                    style={
                        styles.error
                    }
                >

                    ❌ {error}

                </div>

            )}


            {/* ----------------------------------------------------------
                Create Project
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.card
                }
            >

                <h2>
                    📁 Create Project
                </h2>


                <p>
                    Create a new project.
                </p>


                <form
                    onSubmit={
                        handleCreateProject
                    }
                >


                    <input

                        type="text"

                        placeholder="Project name"

                        value={
                            name
                        }

                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }

                        style={
                            styles.input
                        }

                    />


                    <textarea

                        placeholder="Project description"

                        value={
                            description
                        }

                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }

                        style={
                            styles.textarea
                        }

                    />


                    <button

                        type="submit"

                        style={
                            styles.primaryButton
                        }

                    >

                        + Create Project

                    </button>


                </form>

            </div>


            {/* ----------------------------------------------------------
                Projects
            ---------------------------------------------------------- */}

            <div
                style={
                    styles.card
                }
            >


                <div
                    style={
                        styles.projectHeader
                    }
                >

                    <div>

                        <h2>
                            📂 My Projects
                        </h2>


                        <p>
                            Projects belonging to your account.
                        </p>

                    </div>


                    <strong>

                        {
                            projects.length
                        }

                        {" "}

                        project

                        {
                            projects.length !== 1
                                ? "s"
                                : ""
                        }

                    </strong>

                </div>


                {/* ------------------------------------------------------
                    No Projects
                ------------------------------------------------------ */}

                {
                    projects.length === 0
                        ? (

                            <div
                                style={
                                    styles.empty
                                }
                            >

                                <h3>
                                    No projects yet
                                </h3>


                                <p>
                                    Create your first project above.
                                </p>

                            </div>

                        )
                        : (


                            /*
                            --------------------------------------------------
                            Project List
                            --------------------------------------------------
                            */

                            projects.map(
                                (project) => (


                                    <div

                                        key={
                                            project._id
                                        }

                                        style={
                                            styles.projectCard
                                        }

                                    >


                                        {
                                            editingProjectId ===
                                            project._id

                                                ? (


                                                    /*
                                                    --------------------------
                                                    Edit Form
                                                    --------------------------
                                                    */

                                                    <form

                                                        onSubmit={
                                                            handleUpdateProject
                                                        }

                                                    >

                                                        <h3>
                                                            ✏️ Edit Project
                                                        </h3>


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

                                                            style={
                                                                styles.input
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

                                                            style={
                                                                styles.textarea
                                                            }

                                                        />


                                                        <button

                                                            type="submit"

                                                            style={
                                                                styles.primaryButton
                                                            }

                                                        >

                                                            Save Changes

                                                        </button>


                                                        <button

                                                            type="button"

                                                            onClick={
                                                                handleCancelEdit
                                                            }

                                                            style={
                                                                styles.secondaryButton
                                                            }

                                                        >

                                                            Cancel

                                                        </button>


                                                    </form>


                                                )
                                                : (


                                                    /*
                                                    --------------------------
                                                    Normal Project Card
                                                    --------------------------
                                                    */

                                                    <>


                                                        {/* Project Name */}

                                                        <h3>

                                                            📁{" "}

                                                            {
                                                                project.name
                                                            }

                                                        </h3>


                                                        {/* Project Description */}

                                                        <p>

                                                            {
                                                                project.description ||
                                                                "No description provided."
                                                            }

                                                        </p>


                                                        {/* Project ID */}

                                                        <p
                                                            style={
                                                                styles.projectId
                                                            }
                                                        >

                                                            <strong>
                                                                Project ID:
                                                            </strong>{" "}

                                                            {
                                                                project._id
                                                            }

                                                        </p>


                                                        {/* ------------------------------------------------
                                                            Open Project
                                                        ------------------------------------------------
                                                        
                                                        Clicking this button:

                                                        1. Gets project ID.
                                                        2. Saves it in selectedProjectId.
                                                        3. Dashboard displays ProjectDetails.

                                                        ------------------------------------------------ */}

                                                        <button

                                                            onClick={() => {

                                                                /*
                                                                Store selected
                                                                project ID.
                                                                */

                                                                setSelectedProjectId(
                                                                    project._id
                                                                );

                                                            }}

                                                            style={
                                                                styles.openButton
                                                            }

                                                        >

                                                            🚀 Open Project

                                                        </button>


                                                        {/* Edit */}

                                                        <button

                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    project
                                                                )
                                                            }

                                                            style={
                                                                styles.editButton
                                                            }

                                                        >

                                                            ✏️ Edit

                                                        </button>


                                                        {/* Delete */}

                                                        <button

                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project._id
                                                                )
                                                            }

                                                            style={
                                                                styles.deleteButton
                                                            }

                                                        >

                                                            🗑️ Delete

                                                        </button>


                                                    </>


                                                )
                                        }


                                    </div>


                                )
                            )

                        )
                }


            </div>


        </div>

    );

};


/*
|--------------------------------------------------------------------------
| Temporary Styles
|--------------------------------------------------------------------------
|
| These are temporary inline styles.
|
| Later we can move the styling into CSS/Tailwind.
|
|--------------------------------------------------------------------------
*/

const styles = {


    /*
    Page
    */

    page: {

        minHeight:
            "100vh",

        backgroundColor:
            "#f5f7fa",

        padding:
            "30px",

        fontFamily:
            "Arial, Helvetica, sans-serif",

    },


    /*
    Header
    */

    header: {

        maxWidth:
            "900px",

        margin:
            "0 auto 25px",

        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

    },


    /*
    Generic Card
    */

    card: {

        maxWidth:
            "900px",

        margin:
            "20px auto",

        padding:
            "25px",

        backgroundColor:
            "#ffffff",

        border:
            "1px solid #ddd",

        borderRadius:
            "10px",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",

    },


    /*
    Project Header
    */

    projectHeader: {

        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

    },


    /*
    Project Card
    */

    projectCard: {

        marginTop:
            "15px",

        padding:
            "20px",

        border:
            "1px solid #ddd",

        borderRadius:
            "8px",

        backgroundColor:
            "#fafafa",

    },


    /*
    Project ID
    */

    projectId: {

        fontSize:
            "13px",

        color:
            "#666",

        wordBreak:
            "break-all",

    },


    /*
    Input
    */

    input: {

        display:
            "block",

        width:
            "100%",

        boxSizing:
            "border-box",

        padding:
            "10px",

        marginBottom:
            "12px",

        border:
            "1px solid #ccc",

        borderRadius:
            "6px",

        fontSize:
            "15px",

    },


    /*
    Textarea
    */

    textarea: {

        display:
            "block",

        width:
            "100%",

        minHeight:
            "90px",

        boxSizing:
            "border-box",

        padding:
            "10px",

        marginBottom:
            "12px",

        border:
            "1px solid #ccc",

        borderRadius:
            "6px",

        fontSize:
            "15px",

        resize:
            "vertical",

    },


    /*
    Primary Button
    */

    primaryButton: {

        padding:
            "10px 16px",

        border:
            "none",

        borderRadius:
            "6px",

        backgroundColor:
            "#2563eb",

        color:
            "white",

        cursor:
            "pointer",

        marginRight:
            "8px",

    },


    /*
    Secondary Button
    */

    secondaryButton: {

        padding:
            "10px 16px",

        border:
            "1px solid #aaa",

        borderRadius:
            "6px",

        backgroundColor:
            "#ffffff",

        cursor:
            "pointer",

        marginRight:
            "8px",

    },


    /*
    Open Project Button
    */

    openButton: {

        padding:
            "8px 14px",

        border:
            "1px solid #2563eb",

        borderRadius:
            "6px",

        backgroundColor:
            "#ffffff",

        color:
            "#2563eb",

        cursor:
            "pointer",

        marginRight:
            "8px",

    },


    /*
    Edit Button
    */

    editButton: {

        padding:
            "8px 14px",

        border:
            "1px solid #aaa",

        borderRadius:
            "6px",

        backgroundColor:
            "#ffffff",

        cursor:
            "pointer",

        marginRight:
            "8px",

    },


    /*
    Delete Button
    */

    deleteButton: {

        padding:
            "8px 14px",

        border:
            "none",

        borderRadius:
            "6px",

        backgroundColor:
            "#dc2626",

        color:
            "white",

        cursor:
            "pointer",

    },


    /*
    Logout Button
    */

    logoutButton: {

        padding:
            "9px 16px",

        border:
            "none",

        borderRadius:
            "6px",

        backgroundColor:
            "#dc2626",

        color:
            "white",

        cursor:
            "pointer",

    },


    /*
    Error
    */

    error: {

        maxWidth:
            "900px",

        margin:
            "20px auto",

        padding:
            "15px",

        backgroundColor:
            "#fee2e2",

        border:
            "1px solid #fca5a5",

        borderRadius:
            "8px",

        color:
            "#991b1b",

    },


    /*
    Empty Project State
    */

    empty: {

        padding:
            "30px",

        textAlign:
            "center",

        color:
            "#666",

    },

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default Dashboard;