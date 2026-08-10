/*
|--------------------------------------------------------------------------
| File        : ProjectWorkspace.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Main developer workspace for a project.
|
| Contains:
|
| 1. File Explorer
| 2. Code Editor
| 3. AI Assistant
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

import { getProjectFiles } from "../services/project.service.js";


/*
|--------------------------------------------------------------------------
| ProjectWorkspace Component
|--------------------------------------------------------------------------
*/

const ProjectWorkspace = ({
    project,
    onBack,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Project Files
    |--------------------------------------------------------------------------
    |
    | Files received from the backend.
    |
    */

    const [files, setFiles] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Selected File
    |--------------------------------------------------------------------------
    */

    const [selectedFile, setSelectedFile] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    const [filesLoading, setFilesLoading] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    const [filesError, setFilesError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Project Files
    |--------------------------------------------------------------------------
    |
    | Runs whenever the selected project changes.
    |
    */

    useEffect(() => {

        const loadFiles = async () => {

            try {

                setFilesLoading(true);

                setFilesError("");

                /*
                Get project ID.
                */

                const projectId = project?._id;


                if (!projectId) {

                    throw new Error(
                        "Project ID is missing."
                    );
                }


                /*
                Ask backend for project files.
                */

                const projectFiles =
                    await getProjectFiles(projectId);


                /*
                Store files in React state.
                */

                setFiles(projectFiles || []);


            } catch (error) {

                console.error(
                    "Failed to load project files:",
                    error
                );

                setFilesError(
                    error.message ||
                    "Failed to load project files."
                );

            } finally {

                setFilesLoading(false);

            }

        };


        /*
        Only load files when project exists.
        */

        if (project?._id) {

            loadFiles();

        }

    }, [project?._id]);


    /*
    |--------------------------------------------------------------------------
    | Handle File Selection
    |--------------------------------------------------------------------------
    */

    const handleFileSelect = (file) => {

        setSelectedFile(file);

    };


    /*
    |--------------------------------------------------------------------------
    | Get File Name
    |--------------------------------------------------------------------------
    |
    | Backend may return:
    |
    | file.path
    | or
    | file.name
    |
    */

    const getFileName = (file) => {

        return (
            file?.path ||
            file?.name ||
            "Unknown file"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Workspace UI
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.page}>

            {/* ----------------------------------------------------------
                Workspace Header
            ---------------------------------------------------------- */}

            <header style={styles.header}>

                <div>

                    <button
                        onClick={onBack}
                        style={styles.backButton}
                    >
                        ← Back
                    </button>


                    <span style={styles.projectName}>

                        🚀 {project?.name}

                    </span>

                </div>


                <div style={styles.headerRight}>

                    DevPilot AI

                </div>

            </header>


            {/* ----------------------------------------------------------
                Main Workspace
            ---------------------------------------------------------- */}

            <main style={styles.workspace}>

                {/* ======================================================
                    LEFT PANEL
                    FILE EXPLORER
                ====================================================== */}

                <aside style={styles.filePanel}>

                    <div style={styles.panelHeader}>

                        <strong>
                            📁 Files
                        </strong>

                    </div>


                    <div style={styles.fileList}>

                        {/* Loading */}

                        {filesLoading && (

                            <p style={styles.message}>

                                Loading files...

                            </p>

                        )}


                        {/* Error */}

                        {filesError && (

                            <p style={styles.error}>

                                🔴 {filesError}

                            </p>

                        )}


                        {/* No files */}

                        {!filesLoading &&
                            !filesError &&
                            files.length === 0 && (

                                <p style={styles.message}>

                                    No files found.

                                </p>

                            )
                        }


                        {/* Files */}

                        {!filesLoading &&
                            files.map((file) => {

                                const fileName =
                                    getFileName(file);


                                return (

                                    <button
                                        key={
                                            file._id ||
                                            fileName
                                        }

                                        onClick={() =>
                                            handleFileSelect(
                                                file
                                            )
                                        }

                                        style={
                                            selectedFile === file
                                                ? styles.selectedFile
                                                : styles.fileButton
                                        }
                                    >

                                        {fileName.startsWith(
                                            "src/"
                                        )
                                            ? "📄"
                                            : "📋"
                                        }

                                        {" "}

                                        {fileName}

                                    </button>

                                );

                            })
                        }

                    </div>

                </aside>


                {/* ======================================================
                    CENTER PANEL
                    CODE EDITOR
                ====================================================== */}

                <section style={styles.editorPanel}>

                    <div style={styles.panelHeader}>

                        {selectedFile ? (

                            <span>

                                📝{" "}
                                {getFileName(
                                    selectedFile
                                )}

                            </span>

                        ) : (

                            <span>

                                📝 Code Editor

                            </span>

                        )}

                    </div>


                    <div style={styles.editor}>

                        {!selectedFile ? (

                            /*
                            ------------------------------------------------
                            No file selected
                            ------------------------------------------------
                            */

                            <div style={styles.emptyEditor}>

                                <h2>
                                    📝 Select a file
                                </h2>

                                <p>

                                    Choose a file from the explorer
                                    to open it here.

                                </p>

                            </div>

                        ) : (

                            /*
                            ------------------------------------------------
                            File selected
                            ------------------------------------------------
                            */

                            <>

                                <div
                                    style={
                                        styles.editorInfo
                                    }
                                >

                                    <strong>

                                        {getFileName(
                                            selectedFile
                                        )}

                                    </strong>

                                </div>


                                <pre
                                    style={styles.code}
                                >

                                    {selectedFile.content ||
                                        "// This file has no content yet."}

                                </pre>

                            </>

                        )}

                    </div>

                </section>


                {/* ======================================================
                    RIGHT PANEL
                    AI ASSISTANT
                ====================================================== */}

                <aside style={styles.aiPanel}>

                    <div style={styles.panelHeader}>

                        <strong>

                            🤖 DevPilot AI

                        </strong>

                    </div>


                    <div style={styles.aiContent}>

                        <div
                            style={styles.aiWelcome}
                        >

                            <h3>

                                AI Developer Assistant

                            </h3>

                            <p>

                                Ask questions about your
                                project, code, errors, or
                                architecture.

                            </p>

                        </div>


                        <div
                            style={
                                styles.aiPlaceholder
                            }
                        >

                            <p>

                                🤖 AI Assistant

                            </p>

                            <p>

                                Coming next...

                            </p>

                        </div>

                    </div>


                    {/* --------------------------------------------------
                        AI Input
                    -------------------------------------------------- */}

                    <div style={styles.aiInputArea}>

                        <input
                            type="text"
                            placeholder="Ask DevPilot..."
                            style={styles.aiInput}
                        />


                        <button
                            style={styles.askButton}
                        >

                            Ask

                        </button>

                    </div>

                </aside>

            </main>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {

    /*
    Page
    */

    page: {

        height: "100vh",

        display: "flex",

        flexDirection: "column",

        backgroundColor: "#f5f7fa",

        fontFamily:
            "Arial, Helvetica, sans-serif",

    },


    /*
    Header
    */

    header: {

        height: "60px",

        padding: "0 20px",

        backgroundColor: "#ffffff",

        borderBottom: "1px solid #ddd",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

    },


    /*
    Back Button
    */

    backButton: {

        padding: "7px 12px",

        marginRight: "15px",

        border: "1px solid #ccc",

        borderRadius: "6px",

        backgroundColor: "#ffffff",

        cursor: "pointer",

    },


    /*
    Project Name
    */

    projectName: {

        fontWeight: "bold",

        fontSize: "18px",

    },


    /*
    Header Right
    */

    headerRight: {

        fontWeight: "bold",

        color: "#2563eb",

    },


    /*
    Main Workspace
    */

    workspace: {

        flex: 1,

        display: "grid",

        gridTemplateColumns:
            "220px 1fr 320px",

        overflow: "hidden",

    },


    /*
    File Explorer
    */

    filePanel: {

        backgroundColor: "#ffffff",

        borderRight: "1px solid #ddd",

        display: "flex",

        flexDirection: "column",

    },


    /*
    Code Editor
    */

    editorPanel: {

        display: "flex",

        flexDirection: "column",

        backgroundColor: "#1e1e1e",

    },


    /*
    AI Panel
    */

    aiPanel: {

        backgroundColor: "#ffffff",

        borderLeft: "1px solid #ddd",

        display: "flex",

        flexDirection: "column",

    },


    /*
    Panel Header
    */

    panelHeader: {

        height: "45px",

        padding: "0 15px",

        display: "flex",

        alignItems: "center",

        borderBottom: "1px solid #ddd",

        backgroundColor: "#fafafa",

    },


    /*
    File List
    */

    fileList: {

        padding: "10px",

        display: "flex",

        flexDirection: "column",

        gap: "4px",

        overflowY: "auto",

    },


    /*
    File Button
    */

    fileButton: {

        padding: "9px 10px",

        textAlign: "left",

        border: "none",

        backgroundColor: "transparent",

        cursor: "pointer",

        borderRadius: "5px",

    },


    /*
    Selected File
    */

    selectedFile: {

        padding: "9px 10px",

        textAlign: "left",

        border: "none",

        backgroundColor: "#dbeafe",

        color: "#1d4ed8",

        cursor: "pointer",

        borderRadius: "5px",

    },


    /*
    Loading / Empty Message
    */

    message: {

        color: "#666",

        padding: "10px",

    },


    /*
    Error
    */

    error: {

        color: "#dc2626",

        padding: "10px",

        fontSize: "13px",

    },


    /*
    Editor
    */

    editor: {

        flex: 1,

        overflow: "auto",

        color: "#ffffff",

    },


    /*
    Editor Information
    */

    editorInfo: {

        padding: "12px 20px",

        backgroundColor: "#252526",

        borderBottom: "1px solid #333",

    },


    /*
    Code
    */

    code: {

        padding: "20px",

        margin: "0",

        fontFamily:
            "Consolas, monospace",

        fontSize: "14px",

        lineHeight: "1.6",

        whiteSpace: "pre-wrap",

    },


    /*
    Empty Editor
    */

    emptyEditor: {

        height: "100%",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        color: "#aaa",

        textAlign: "center",

    },


    /*
    AI Content
    */

    aiContent: {

        flex: 1,

        padding: "15px",

        overflow: "auto",

    },


    /*
    AI Welcome
    */

    aiWelcome: {

        padding: "15px",

        border: "1px solid #ddd",

        borderRadius: "8px",

        backgroundColor: "#f8fafc",

    },


    /*
    AI Placeholder
    */

    aiPlaceholder: {

        marginTop: "20px",

        padding: "20px",

        textAlign: "center",

        border: "1px dashed #bbb",

        borderRadius: "8px",

        color: "#666",

    },


    /*
    AI Input Area
    */

    aiInputArea: {

        padding: "12px",

        borderTop: "1px solid #ddd",

        display: "flex",

        gap: "8px",

    },


    /*
    AI Input
    */

    aiInput: {

        flex: 1,

        padding: "10px",

        border: "1px solid #ccc",

        borderRadius: "6px",

        outline: "none",

    },


    /*
    Ask Button
    */

    askButton: {

        padding: "10px 14px",

        border: "none",

        borderRadius: "6px",

        backgroundColor: "#2563eb",

        color: "#ffffff",

        cursor: "pointer",

    },

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default ProjectWorkspace;