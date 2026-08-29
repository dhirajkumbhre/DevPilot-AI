/*
|--------------------------------------------------------------------------
| DevPilot Project Workspace
|--------------------------------------------------------------------------
|
| Main development workspace for a project.
|
| Contains:
|
| 1. Project file explorer
| 2. Code editor
| 3. File saving
| 4. AI assistant
| 5. AI code-change preview
|
|--------------------------------------------------------------------------
*/
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

import {
    getProjectFiles,
    updateProjectFile,
} from "../services/project.service.js";

import AIChat from "../components/AIChat.jsx";

import CodeChangePreview from "../components/CodeChangePreview.jsx";

import "./ProjectWorkspace.css";

import "../styles/code-change-preview.css";





const getEditorLanguage = (filePath = "") => {
    const extension = filePath.split(".").pop()?.toLowerCase();

    const languages = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        json: "json",
        css: "css",
        html: "html",
        md: "markdown",
    };

    return languages[extension] || "plaintext";
};
/*
|--------------------------------------------------------------------------
| File Icon
|--------------------------------------------------------------------------
*/

const getFileIcon = (path = "") => {

    if (
        path.endsWith(".jsx") ||
        path.endsWith(".js")
    ) {
        return "JS";
    }


    if (path.endsWith(".json")) {
        return "{}";
    }


    if (path.endsWith(".md")) {
        return "MD";
    }


    if (path.endsWith(".css")) {
        return "#";
    }


    if (path.endsWith(".html")) {
        return "<>";
    }


    return "•";
};


/*
|--------------------------------------------------------------------------
| Project Workspace
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
    */

    const [files, setFiles] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Selected File
    |--------------------------------------------------------------------------
    */

    const [selectedFile, setSelectedFile] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Editor Content
    |--------------------------------------------------------------------------
    */

    const [fileContent, setFileContent] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | Workspace Error
    |--------------------------------------------------------------------------
    */

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Save Status
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
    | AI Proposed Change
    |--------------------------------------------------------------------------
    |
    | Stores the original and AI-generated code until
    | the developer chooses Apply or Reject.
    |
    |--------------------------------------------------------------------------
    */

    const [proposedChange, setProposedChange] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Project Files
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadFiles = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                --------------------------------------------------------------
                | Get project files from backend
                --------------------------------------------------------------
                */

                const loadedFiles =
                    await getProjectFiles(
                        project._id
                    );


                setFiles(
                    loadedFiles
                );


                /*
                --------------------------------------------------------------
                | Automatically select first file
                --------------------------------------------------------------
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

                    setSelectedFile(
                        null
                    );

                    setFileContent(
                        ""
                    );

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


        if (project?._id) {

            loadFiles();

        }

    }, [project]);


    /*
    |--------------------------------------------------------------------------
    | Select File
    |--------------------------------------------------------------------------
    */

    const handleSelectFile = (
        file
    ) => {

        setSelectedFile(
            file
        );


        setFileContent(
            file.content || ""
        );


        setSaveStatus("");

        setSaveError("");


        /*
        ----------------------------------------------------------------------
        | Remove any previous AI proposal
        ----------------------------------------------------------------------
        */

        setProposedChange(
            null
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Editor Change
    |--------------------------------------------------------------------------
    */

    const handleEditorChange = (
        event
    ) => {

        setFileContent(
            event.target.value
        );


        setSaveStatus(
            "unsaved"
        );


        setSaveError("");

    };


    /*
    |--------------------------------------------------------------------------
    | Save File
    |--------------------------------------------------------------------------
    */

    const handleSaveFile = async () => {

        if (
            !selectedFile ||
            saveStatus === "saving"
        ) {
            return;
        }


        try {

            setSaveStatus(
                "saving"
            );


            setSaveError("");


            /*
            ------------------------------------------------------------------
            | Send updated content to backend
            ------------------------------------------------------------------
            */

            const updatedFile =
                await updateProjectFile(

                    project._id,

                    selectedFile._id,

                    fileContent

                );


            /*
            ------------------------------------------------------------------
            | Update selected file
            ------------------------------------------------------------------
            */

            setSelectedFile(
                updatedFile
            );


            /*
            ------------------------------------------------------------------
            | Update file explorer
            ------------------------------------------------------------------
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
            ------------------------------------------------------------------
            | Update editor content
            ------------------------------------------------------------------
            */

            setFileContent(
                updatedFile.content || ""
            );


            /*
            ------------------------------------------------------------------
            | Saved successfully
            ------------------------------------------------------------------
            */

            setSaveStatus(
                "saved"
            );

        } catch (err) {

            console.error(
                "Save file error:",
                err
            );


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
    | Keyboard Save
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const handleKeyboardSave = (
            event
        ) => {

            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();

                handleSaveFile();

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyboardSave
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyboardSave
            );

        };

    });


    /*
    |--------------------------------------------------------------------------
    | Receive AI Proposed Change
    |--------------------------------------------------------------------------
    */

    const handleProposedChange = ({
        originalCode,
        proposedCode,
    }) => {

        /*
        ----------------------------------------------------------------------
        | Store the proposal
        ----------------------------------------------------------------------
        */

        setProposedChange({

            originalCode,

            proposedCode,

        });

    };


    /*
    |--------------------------------------------------------------------------
    | Apply AI Change
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Applying the AI change only updates the editor.
    |
    | It does NOT immediately save to MongoDB.
    |
    | The developer must still press Save.
    |
    |--------------------------------------------------------------------------
    */

    const handleApplyChange = () => {

        if (!proposedChange) {
            return;
        }


        /*
        ----------------------------------------------------------------------
        | Replace editor content
        ----------------------------------------------------------------------
        */

        setFileContent(
            proposedChange.proposedCode
        );


        /*
        ----------------------------------------------------------------------
        | Mark file as unsaved
        ----------------------------------------------------------------------
        */

        setSaveStatus(
            "unsaved"
        );


        /*
        ----------------------------------------------------------------------
        | Clear previous save error
        ----------------------------------------------------------------------
        */

        setSaveError("");


        /*
        ----------------------------------------------------------------------
        | Close preview
        ----------------------------------------------------------------------
        */

        setProposedChange(
            null
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Reject AI Change
    |--------------------------------------------------------------------------
    */

    const handleRejectChange = () => {

        /*
        ----------------------------------------------------------------------
        | Do not modify editor content.
        |
        | Simply close the proposal.
        ----------------------------------------------------------------------
        */

        setProposedChange(
            null
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        if (
            typeof onBack === "function"
        ) {

            onBack();

            return;

        }


        window.history.back();

    };


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="workspace-page">

                <div className="workspace-state-card">

                    <div className="state-icon">
                        ⌛
                    </div>

                    <h2>
                        Opening workspace
                    </h2>

                    <p>
                        Loading your project files...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="workspace-page">

                <div className="workspace-state-card">

                    <div className="state-icon error">
                        !
                    </div>

                    <h2>
                        Couldn’t load workspace
                    </h2>

                    <p className="state-error">
                        {error}
                    </p>

                    <button
                        className="primary-button"
                        onClick={handleBack}
                    >
                        ← Back to project
                    </button>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Workspace UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="workspace-page">


            {/* ==============================================================
                TOP BAR
            ============================================================== */}

            <header className="workspace-topbar">

                <div className="topbar-left">

                    <button
                        className="back-button"
                        onClick={handleBack}
                    >

                        <span>
                            ←
                        </span>

                        Back

                    </button>


                    <div className="brand-divider" />


                    <div className="brand">

                        <div className="brand-mark">
                            DK
                        </div>

                        <div>

                            <div className="brand-name">
                                DevPilot AI
                            </div>

                            <div className="brand-subtitle">
                                Developer workspace
                            </div>

                        </div>

                    </div>

                </div>


                <div className="project-badge">

                    <span className="status-dot" />

                    <span>
                        {project?.name ||
                            "Untitled project"}
                    </span>

                </div>

            </header>


            {/* ==============================================================
                MAIN WORKSPACE
            ============================================================== */}

            <main className="workspace-shell">


                {/* ==========================================================
                    LEFT: FILE EXPLORER
                ========================================================== */}

                <aside className="file-explorer">

                    <div className="panel-heading">

                        <div>

                            <span className="panel-title">
                                Explorer
                            </span>

                            <span className="panel-subtitle">
                                Project files
                            </span>

                        </div>


                        <span className="file-count">
                            {files.length}
                        </span>

                    </div>


                    <div className="file-tree">

                        {files.length === 0 ? (

                            <div className="empty-files">

                                <div className="empty-files-icon">
                                    📁
                                </div>

                                <strong>
                                    No files
                                </strong>

                                <span>
                                    This project has no files yet.
                                </span>

                            </div>

                        ) : (

                            files.map(
                                (file) => (

                                    <button
                                        key={file._id}

                                        className={
                                            `file-row ${
                                                selectedFile?._id ===
                                                file._id
                                                    ? "active"
                                                    : ""
                                            }`
                                        }

                                        onClick={() =>
                                            handleSelectFile(
                                                file
                                            )
                                        }

                                        title={
                                            file.path
                                        }
                                    >

                                        <span
                                            className={
                                                `file-type type-${getFileIcon(
                                                    file.path
                                                )}`
                                            }
                                        >
                                            {getFileIcon(
                                                file.path
                                            )}
                                        </span>


                                        <span className="file-path">

                                            {file.path}

                                        </span>


                                        {selectedFile?._id ===
                                            file._id &&
                                            saveStatus ===
                                                "unsaved" && (

                                            <span
                                                className="unsaved-dot"
                                            />

                                        )}

                                    </button>

                                )
                            )

                        )}

                    </div>


                    <div className="explorer-footer">

                        <span>
                            WORKSPACE
                        </span>

                        <span className="footer-online">

                            <span className="tiny-dot" />

                            Connected

                        </span>

                    </div>

                </aside>


                {/* ==========================================================
                    CENTER: CODE EDITOR
                ========================================================== */}

                <section className="editor-panel">


                    {/* ------------------------------------------------------
                        Editor Tabs
                    ------------------------------------------------------ */}

                    <div className="editor-tabs">

                        <div className="editor-tab active">

                            <span className="tab-file-icon">

                                {selectedFile
                                    ? getFileIcon(
                                        selectedFile.path
                                    )
                                    : "•"}

                            </span>


                            <span>

                                {selectedFile

                                    ? selectedFile.path
                                        .split("/")
                                        .pop()

                                    : "No file"}

                            </span>


                            {saveStatus ===
                                "unsaved" && (

                                <span className="tab-unsaved">
                                    ●
                                </span>

                            )}

                        </div>


                        <div className="editor-actions">


                            {saveStatus ===
                                "unsaved" && (

                                <span
                                    className={
                                        "save-status unsaved"
                                    }
                                >
                                    ● Unsaved changes
                                </span>

                            )}


                            {saveStatus ===
                                "saving" && (

                                <span
                                    className={
                                        "save-status saving"
                                    }
                                >
                                    Saving...
                                </span>

                            )}


                            {saveStatus ===
                                "saved" && (

                                <span
                                    className={
                                        "save-status saved"
                                    }
                                >
                                    ✓ Saved to database
                                </span>

                            )}


                            {saveStatus ===
                                "error" && (

                                <span
                                    className={
                                        "save-status failed"
                                    }
                                >
                                    ✕ Save failed
                                </span>

                            )}


                            <button
                                className="save-button"

                                onClick={
                                    handleSaveFile
                                }

                                disabled={
                                    !selectedFile ||
                                    saveStatus ===
                                        "saving"
                                }
                            >

                                <span>
                                    ↥
                                </span>

                                Save

                                <kbd>
                                    Ctrl S
                                </kbd>

                            </button>

                        </div>

                    </div>


                    {/* ------------------------------------------------------
                        Save Error
                    ------------------------------------------------------ */}

                    {saveError && (

                        <div className="save-error-banner">

                            <span>
                                ⚠
                            </span>

                            {saveError}

                        </div>

                    )}


                    {/* ------------------------------------------------------
                        Editor
                    ------------------------------------------------------ */}

                    {selectedFile ? (

                        <div className="editor-area">


                            <div className="editor-path">

                                <span>
                                    src
                                </span>

                                <span>
                                    /
                                </span>

                                <strong>
                                    {selectedFile.path}
                                </strong>

                            </div>


                            <div className="editor-body">


                                <div
                                    className="line-numbers"
                                    aria-hidden="true"
                                >

                                    {fileContent
                                        .split("\n")
                                        .map(
                                            (
                                                _,
                                                index
                                            ) => (

                                                <span
                                                    key={
                                                        index
                                                    }
                                                >
                                                    {index + 1}
                                                </span>

                                            )
                                        )}

                                </div>


<Editor
    height="100%"
    language={getEditorLanguage(selectedFile?.path)}
    theme="vs-dark"
    value={fileContent}
    onChange={(value) => {
        handleEditorChange({
            target: {
                value: value ?? "",
            },
        });
    }}
    options={{
        minimap: {
            enabled: false,
        },
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 4,
        padding: {
            top: 12,
        },
    }}
/>

                            </div>


                            <div className="editor-statusbar">


                                <div className="statusbar-left">

                                    <span>
                                        UTF-8
                                    </span>

                                    <span>
                                        LF
                                    </span>

                                    <span>
                                        {getFileIcon(
                                            selectedFile.path
                                        )}
                                    </span>

                                </div>


                                <div className="statusbar-right">

                                    <span>
                                        {fileContent.length}
                                        {" "}
                                        chars
                                    </span>

                                    <span>
                                        {fileContent.split("\n").length}
                                        {" "}
                                        lines
                                    </span>

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="empty-editor">

                            <div className="empty-editor-icon">
                                ⌘
                            </div>

                            <h2>
                                Select a file
                            </h2>

                            <p>
                                Choose a file from Explorer
                                to start editing.
                            </p>

                        </div>

                    )}

                </section>


                {/* ==========================================================
                    RIGHT: AI PANEL
                ========================================================== */}

                <aside className="ai-panel">


                    {/* ======================================================
                        AI PROPOSED CHANGE
                    ====================================================== */}

                    {proposedChange && (

                        <CodeChangePreview

                            filePath={
                                selectedFile?.path
                            }

                            originalCode={
                                proposedChange.originalCode
                            }

                            proposedCode={
                                proposedChange.proposedCode
                            }

                            onApply={
                                handleApplyChange
                            }

                            onReject={
                                handleRejectChange
                            }

                        />

                    )}


                    {/* ======================================================
                        AI CHAT
                    ====================================================== */}

                    <AIChat

                        projectId={
                            project?._id
                        }

                        fileId={
                            selectedFile?._id
                        }

                        fileContent={
                            fileContent
                        }

                        onProposedChange={
                            handleProposedChange
                        }

                    />

                </aside>

            </main>

        </div>

    );

};


export default ProjectWorkspace;