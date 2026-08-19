/*
|--------------------------------------------------------------------------
| File        : ProjectWorkspace.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Main development workspace for a project.
|
| Responsibilities:
|
| 1. Load project files from MongoDB.
| 2. Display files in the file explorer.
| 3. Allow the user to edit file content.
| 4. Save edited content back to MongoDB.
| 5. Show real saving/success/error status.
| 6. Allow the user to return to Project Details.
|
|--------------------------------------------------------------------------
|
| Architecture:
|
| ProjectWorkspace
|       |
|       ├── getProjectFiles()
|       │        ↓
|       │   Express API
|       │        ↓
|       │     MongoDB
|       |
|       └── updateProjectFile()
|                ↓
|           Express API
|                ↓
|              MongoDB
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

import AIChat from "../components/AIChat.jsx";

import CodeChangePreview from "../components/CodeChangePreview.jsx";

/*
|--------------------------------------------------------------------------
| Project API Services
|--------------------------------------------------------------------------
|
| These functions contain the actual HTTP communication with our backend.
|
|--------------------------------------------------------------------------
*/

import {
    getProjectFiles,
    updateProjectFile,
} from "../services/project.service.js";


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
    | Stores all files returned by the backend.
    |
    |--------------------------------------------------------------------------
    */

    const [files, setFiles] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Selected File
    |--------------------------------------------------------------------------
    |
    | Stores the file currently opened in the editor.
    |
    |--------------------------------------------------------------------------
    */

    const [selectedFile, setSelectedFile] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Editor Content
    |--------------------------------------------------------------------------
    |
    | This contains whatever is currently written
    | inside the code editor.
    |
    |--------------------------------------------------------------------------
    */

    const [fileContent, setFileContent] =
        useState("");









        /*
|--------------------------------------------------------------------------
| AI Proposed Change
|--------------------------------------------------------------------------
*/

const [proposedChange, setProposedChange] =
    useState(null);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Save State
    |--------------------------------------------------------------------------
    |
    | Possible values:
    |
    | ""
    | "saving"
    | "saved"
    | "error"
    |
    |--------------------------------------------------------------------------
    */

    const [saveStatus, setSaveStatus] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Save Error
    |--------------------------------------------------------------------------
    */

    const [saveError, setSaveError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Project Files
    |--------------------------------------------------------------------------
    |
    | Runs whenever the selected project changes.
    |
    | GET:
    |
    | /api/projects/:projectId/files
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadFiles = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                Call our frontend API service.
                */

                const loadedFiles =
                    await getProjectFiles(
                        project._id
                    );


                /*
                Store files in React state.
                */

                setFiles(
                    loadedFiles
                );


                /*
                Automatically open the first file.
                */

                if (
                    loadedFiles.length > 0
                ) {

                    setSelectedFile(
                        loadedFiles[0]
                    );

                    setFileContent(
                        loadedFiles[0].content || ""
                    );

                } else {

                    setSelectedFile(null);

                    setFileContent("");

                }

            } catch (err) {

                console.error(
                    "Failed to load project files:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to load project files"
                );

            } finally {

                setLoading(false);

            }

        };


        /*
        Only load files if a project exists.
        */

        if (project?._id) {

            loadFiles();

        }

    }, [project]);


    /*
    |--------------------------------------------------------------------------
    | Select File
    |--------------------------------------------------------------------------
    |
    | When the user clicks a file:
    |
    | 1. Store the selected file.
    | 2. Put its content into the editor.
    |
    |--------------------------------------------------------------------------
    */

    const handleSelectFile = (
        file
    ) => {

        setSelectedFile(file);

        setFileContent(
            file.content || ""
        );

        /*
        Clear previous save messages.
        */

        setSaveStatus("");

        setSaveError("");

    };


    /*
    |--------------------------------------------------------------------------
    | Handle Editor Changes
    |--------------------------------------------------------------------------
    |
    | Every time the user types something:
    |
    | textarea
    |    ↓
    | fileContent state
    |
    |--------------------------------------------------------------------------
    */

    const handleEditorChange = (
        event
    ) => {

        setFileContent(
            event.target.value
        );

        /*
        The current editor content is different
        from what was last saved.
        */

        setSaveStatus(
            "unsaved"
        );

        setSaveError("");

    };


    /*
|--------------------------------------------------------------------------
| AI Proposed Change
|--------------------------------------------------------------------------
*/

const handleProposedChange = ({
    originalCode,
    proposedCode,
}) => {

    setProposedChange({

        originalCode,

        proposedCode,

    });

};




/*
|--------------------------------------------------------------------------
| Apply AI Change
|--------------------------------------------------------------------------
*/

const handleApplyChange = () => {

    if (!proposedChange) {
        return;
    }


    setFileContent(
        proposedChange.proposedCode
    );


    setSaveStatus("unsaved");

    setSaveError("");


    setProposedChange(null);

};



/*
|--------------------------------------------------------------------------
| Reject AI Change
|--------------------------------------------------------------------------
*/

const handleRejectChange = () => {

    setProposedChange(null);

};

    /*
    |--------------------------------------------------------------------------
    | Save File
    |--------------------------------------------------------------------------
    |
    | THIS IS THE IMPORTANT PART.
    |
    | Previously we only changed React state.
    |
    | Now:
    |
    | React
    |   ↓
    | updateProjectFile()
    |   ↓
    | PUT /api/projects/:id/files/:fileId
    |   ↓
    | Express
    |   ↓
    | MongoDB
    |
    |--------------------------------------------------------------------------
    */

    const handleSaveFile = async () => {

        /*
        We cannot save if no file is selected.
        */

        if (!selectedFile) {

            return;

        }


        try {

            /*
            Show saving state.
            */

            setSaveStatus(
                "saving"
            );

            setSaveError("");


            /*
            Send the edited content to the backend.
            */

            const updatedFile =
                await updateProjectFile(
                    project._id,
                    selectedFile._id,
                    fileContent
                );


            /*
            Update the selected file with the
            version returned by MongoDB.
            */

            setSelectedFile(
                updatedFile
            );


            /*
            Update the file inside our files array.
            */

            setFiles(
                (currentFiles) =>

                    currentFiles.map(
                        (file) =>

                            file._id ===
                            updatedFile._id

                                ? updatedFile

                                : file
                    )
            );


            /*
            Make sure the editor contains
            exactly what the backend returned.
            */

            setFileContent(
                updatedFile.content || ""
            );


            /*
            IMPORTANT:
            Only show "Saved" AFTER the backend
            successfully responds.
            */

            setSaveStatus(
                "saved"
            );


        } catch (err) {

            console.error(
                "Save file error:",
                err
            );


            /*
            Do NOT say "Saved" if MongoDB
            rejected the request.
            */

            setSaveStatus(
                "error"
            );

            setSaveError(
                err.message ||
                "Failed to save file"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Back Button
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        /*
        ProjectDetails normally provides onBack.
        */

        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

            return;

        }


        /*
        Fallback to browser history.
        */

        window.history.back();

    };


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div style={styles.page}>

                <div
                    style={
                        styles.centerCard
                    }
                >

                    <div
                        style={
                            styles.loadingIcon
                        }
                    >
                        ⏳
                    </div>

                    <h2>
                        Loading workspace...
                    </h2>

                    <p>
                        Loading project files
                        from MongoDB.
                    </p>

                </div>

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

            <div style={styles.page}>

                <div
                    style={
                        styles.centerCard
                    }
                >

                    <div
                        style={
                            styles.errorIcon
                        }
                    >
                        ⚠️
                    </div>

                    <h2>
                        Failed to load workspace
                    </h2>

                    <p style={styles.errorText}>
                        {error}
                    </p>

                    <button
                        onClick={
                            handleBack
                        }
                        style={
                            styles.backButton
                        }
                    >
                        ← Back
                    </button>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Main Workspace
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.page}>

            {/* ==========================================================
                TOP HEADER
            ========================================================== */}

            <header
                style={
                    styles.header
                }
            >

                <div
                    style={
                        styles.headerLeft
                    }
                >

                    <button
                        onClick={
                            handleBack
                        }
                        style={
                            styles.backButton
                        }
                    >
                        ← Back
                    </button>


                    <div
                        style={
                            styles.projectInfo
                        }
                    >

                        <div
                            style={
                                styles.projectName
                            }
                        >
                            🚀{" "}
                            {project?.name ||
                                "Project"}
                        </div>

                        <div
                            style={
                                styles.projectSubtitle
                            }
                        >
                            Development Workspace
                        </div>

                    </div>

                </div>


                <div
                    style={
                        styles.brand
                    }
                >
                    DevPilot AI
                </div>

            </header>


            {/* ==========================================================
                MAIN WORKSPACE
            ========================================================== */}

            <main
                style={
                    styles.workspace
                }
            >

                {/* ======================================================
                    LEFT FILE EXPLORER
                ====================================================== */}

                <aside
                    style={
                        styles.sidebar
                    }
                >

                    <div
                        style={
                            styles.sidebarHeader
                        }
                    >

                        <span>
                            📁 Explorer
                        </span>

                        <span
                            style={
                                styles.fileCount
                            }
                        >
                            {files.length}
                        </span>

                    </div>


                    <div
                        style={
                            styles.fileList
                        }
                    >

                        {files.length === 0 ? (

                            <div
                                style={
                                    styles.emptyFiles
                                }
                            >
                                No files found.
                            </div>

                        ) : (

                            files.map(
                                (file) => (

                                    <button
                                        key={
                                            file._id
                                        }
                                        onClick={() =>
                                            handleSelectFile(
                                                file
                                            )
                                        }
                                        style={{
                                            ...styles.fileButton,

                                            ...(selectedFile?._id ===
                                            file._id
                                                ? styles.selectedFile
                                                : {}),
                                        }}
                                    >

                                        <span>
                                            {file.path.startsWith(
                                                "src/"
                                            )
                                                ? "📄"
                                                : file.path.endsWith(
                                                      ".json"
                                                  )
                                                ? "🧩"
                                                : file.path.endsWith(
                                                      ".md"
                                                  )
                                                ? "📝"
                                                : "📄"}
                                        </span>

                                        <span
                                            style={
                                                styles.fileName
                                            }
                                        >
                                            {
                                                file.path
                                            }
                                        </span>

                                    </button>

                                )
                            )

                        )}

                    </div>

                </aside>


                {/* ======================================================
                    CENTER CODE EDITOR
                ====================================================== */}

                <section
                    style={
                        styles.editorSection
                    }
                >

                    {/* --------------------------------------------------
                        Editor Header
                    -------------------------------------------------- */}

                    <div
                        style={
                            styles.editorHeader
                        }
                    >

                        <div
                            style={
                                styles.editorFile
                            }
                        >

                            <span>
                                {selectedFile
                                    ? "📄"
                                    : "📄"}
                            </span>

                            <span>
                                {selectedFile
                                    ? selectedFile.path
                                    : "No file selected"}
                            </span>

                        </div>


                        <div
                            style={
                                styles.editorActions
                            }
                        >

                            {/* Save Status */}

                            {saveStatus ===
                                "unsaved" && (

                                <span
                                    style={
                                        styles.unsavedStatus
                                    }
                                >
                                    ● Unsaved
                                </span>

                            )}


                            {saveStatus ===
                                "saving" && (

                                <span
                                    style={
                                        styles.savingStatus
                                    }
                                >
                                    Saving...
                                </span>

                            )}


                            {saveStatus ===
                                "saved" && (

                                <span
                                    style={
                                        styles.savedStatus
                                    }
                                >
                                    ✓ Saved
                                </span>

                            )}


                            {saveStatus ===
                                "error" && (

                                <span
                                    style={
                                        styles.saveErrorStatus
                                    }
                                >
                                    ✕ Save failed
                                </span>

                            )}


                            <button
                                onClick={
                                    handleSaveFile
                                }
                                disabled={
                                    !selectedFile ||
                                    saveStatus ===
                                        "saving"
                                }
                                style={{
                                    ...styles.saveButton,

                                    ...(
                                        !selectedFile ||
                                        saveStatus ===
                                            "saving"
                                            ? styles.disabledButton
                                            : {}
                                    ),
                                }}
                            >
                                💾 Save
                            </button>

                        </div>

                    </div>


                    {/* --------------------------------------------------
                        Save Error
                    -------------------------------------------------- */}

                    {saveError && (

                        <div
                            style={
                                styles.saveError
                            }
                        >
                            ⚠️ {saveError}
                        </div>

                    )}


                    {/* --------------------------------------------------
                        Editor
                    -------------------------------------------------- */}

                    {selectedFile ? (

                        <div
                            style={
                                styles.editorContainer
                            }
                        >

                            <div
                                style={
                                    styles.editorLineBar
                                }
                            >
                                <span>
                                    {selectedFile.path}
                                </span>
                            </div>


                            <textarea
                                value={
                                    fileContent
                                }
                                onChange={
                                    handleEditorChange
                                }
                                spellCheck={
                                    false
                                }
                                autoCapitalize="off"
                                autoCorrect="off"
                                autoComplete="off"
                                style={
                                    styles.codeEditor
                                }
                            />

                        </div>

                    ) : (

                        <div
                            style={
                                styles.emptyEditor
                            }
                        >

                            <div
                                style={
                                    styles.emptyEditorIcon
                                }
                            >
                                📄
                            </div>

                            <h2>
                                Select a file
                            </h2>

                            <p>
                                Choose a file from
                                the Explorer to start
                                editing.
                            </p>

                        </div>

                    )}

                </section>


                
                
                {/* ======================================================
                    RIGHT AI PANEL
                ====================================================== */}

{/* ======================================================
    RIGHT AI PANEL
====================================================== */}

<aside style={styles.aiPanel}>

    <AIChat
        projectId={project?._id}
        fileId={selectedFile?._id}
        fileContent={fileContent}
        onProposedChange={
            handleProposedChange
        }
    />

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

    page: {
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
        padding: "16px",
        boxSizing: "border-box",
    },


    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    header: {
        height: "64px",
        maxWidth: "1500px",
        margin: "0 auto 12px",
        padding: "0 18px",
        backgroundColor: "#111827",
        border:
            "1px solid #1f2937",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
    },


    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },


    backButton: {
        padding:
            "8px 14px",
        border:
            "1px solid #374151",
        borderRadius: "7px",
        backgroundColor: "#1f2937",
        color: "#e5e7eb",
        cursor: "pointer",
        fontSize: "14px",
    },


    projectInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },


    projectName: {
        fontSize: "17px",
        fontWeight: "700",
    },


    projectSubtitle: {
        fontSize: "12px",
        color: "#9ca3af",
    },


    brand: {
        fontSize: "17px",
        fontWeight: "700",
        color: "#38bdf8",
    },


    /*
    |--------------------------------------------------------------------------
    | Workspace
    |--------------------------------------------------------------------------
    */

    workspace: {
        maxWidth: "1500px",
        minHeight: "calc(100vh - 108px)",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns:
            "240px minmax(0, 1fr) 330px",
        backgroundColor: "#111827",
        border:
            "1px solid #1f2937",
        borderRadius: "10px",
        overflow: "hidden",
    },


    /*
    |--------------------------------------------------------------------------
    | Sidebar
    |--------------------------------------------------------------------------
    */

    sidebar: {
        backgroundColor: "#0b1220",
        borderRight:
            "1px solid #1f2937",
        minHeight: "650px",
        display: "flex",
        flexDirection: "column",
    },


    sidebarHeader: {
        height: "52px",
        padding: "0 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid #1f2937",
        fontSize: "14px",
    },


    fileCount: {
        minWidth: "22px",
        padding: "2px 6px",
        borderRadius: "10px",
        backgroundColor: "#1f2937",
        color: "#9ca3af",
        fontSize: "11px",
        textAlign: "center",
    },


    fileList: {
        padding: "8px",
        overflowY: "auto",
    },


    fileButton: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "9px 10px",
        marginBottom: "2px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "transparent",
        color: "#cbd5e1",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "13px",
    },


    selectedFile: {
        backgroundColor: "#1e3a5f",
        color: "#ffffff",
    },


    fileName: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },


    emptyFiles: {
        padding: "20px 12px",
        color: "#6b7280",
        fontSize: "13px",
    },


    /*
    |--------------------------------------------------------------------------
    | Editor
    |--------------------------------------------------------------------------
    */

    editorSection: {
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
    },


    editorHeader: {
        minHeight: "52px",
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        backgroundColor: "#111827",
        borderBottom:
            "1px solid #1f2937",
        boxSizing: "border-box",
    },


    editorFile: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "#d1d5db",
        overflow: "hidden",
    },


    editorActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },


    saveButton: {
        padding:
            "8px 15px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px",
    },


    disabledButton: {
        opacity: 0.5,
        cursor: "not-allowed",
    },


    unsavedStatus: {
        color: "#f59e0b",
        fontSize: "12px",
    },


    savingStatus: {
        color: "#60a5fa",
        fontSize: "12px",
    },


    savedStatus: {
        color: "#4ade80",
        fontSize: "12px",
    },


    saveErrorStatus: {
        color: "#f87171",
        fontSize: "12px",
    },


    saveError: {
        padding: "8px 14px",
        backgroundColor: "#3f1d1d",
        color: "#fca5a5",
        borderBottom:
            "1px solid #7f1d1d",
        fontSize: "12px",
    },


    editorContainer: {
        flex: 1,
        minHeight: "590px",
        display: "flex",
        flexDirection: "column",
    },


    editorLineBar: {
        height: "30px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        backgroundColor: "#161b22",
        color: "#6b7280",
        borderBottom:
            "1px solid #21262d",
        fontSize: "11px",
    },


    codeEditor: {
        flex: 1,
        width: "100%",
        minHeight: "560px",
        resize: "none",
        outline: "none",
        border: "none",
        padding: "18px",
        boxSizing: "border-box",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily:
            "Consolas, Monaco, 'Courier New', monospace",
        fontSize: "14px",
        lineHeight: "1.65",
        whiteSpace: "pre",
        tabSize: 4,
    },


    emptyEditor: {
        flex: 1,
        minHeight: "590px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#6b7280",
        textAlign: "center",
    },


    emptyEditorIcon: {
        fontSize: "42px",
        marginBottom: "10px",
    },


    /*
    |--------------------------------------------------------------------------
    | AI Panel
    |--------------------------------------------------------------------------
    */

    aiPanel: {
        minHeight: "650px",
        backgroundColor: "#111827",
        borderLeft:
            "1px solid #1f2937",
        display: "flex",
        flexDirection: "column",
    },


    aiHeader: {
        minHeight: "52px",
        padding: "0 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom:
            "1px solid #1f2937",
        fontSize: "14px",
        fontWeight: "600",
    },


    aiStatus: {
        fontSize: "11px",
        color: "#4ade80",
        backgroundColor: "#052e16",
        padding: "4px 7px",
        borderRadius: "10px",
    },


    aiContent: {
        padding: "18px",
        overflowY: "auto",
    },


    aiWelcome: {
        padding: "20px",
        backgroundColor: "#0f172a",
        border:
            "1px solid #1f2937",
        borderRadius: "10px",
        textAlign: "center",
    },


    aiLargeIcon: {
        fontSize: "38px",
        marginBottom: "8px",
    },





    aiSuggestions: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        marginTop: "15px",
    },


    suggestion: {
        padding: "11px 12px",
        backgroundColor: "#0f172a",
        border:
            "1px solid #1f2937",
        borderRadius: "7px",
        color: "#cbd5e1",
        fontSize: "12px",
    },


    aiComingSoon: {
        marginTop: "15px",
        padding: "15px",
        border:
            "1px dashed #374151",
        borderRadius: "8px",
        color: "#6b7280",
        textAlign: "center",
        fontSize: "12px",
    },


    /*
    |--------------------------------------------------------------------------
    | Loading / Error
    |--------------------------------------------------------------------------
    */

    centerCard: {
        maxWidth: "500px",
        margin: "100px auto",
        padding: "40px",
        backgroundColor: "#111827",
        border:
            "1px solid #1f2937",
        borderRadius: "12px",
        textAlign: "center",
        boxSizing: "border-box",
    },


    loadingIcon: {
        fontSize: "35px",
    },


    errorIcon: {
        fontSize: "35px",
    },


    errorText: {
        color: "#f87171",
        lineHeight: "1.6",
    },

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default ProjectWorkspace;