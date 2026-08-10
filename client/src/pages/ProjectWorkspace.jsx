/*
|--------------------------------------------------------------------------
| File        : ProjectWorkspace.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| --------
| This is the main developer workspace for a project.
|
| Eventually this screen will contain:
|
|     File Explorer
|          +
|     Code Editor
|          +
|     AI Assistant
|
| For now we are creating the layout and understanding
| how the three major areas communicate.
|
|--------------------------------------------------------------------------
|
| Future Architecture:
|
| ProjectWorkspace
|       |
|       ├── FileExplorer
|       |
|       ├── CodeEditor
|       |
|       └── AIAssistant
|
|--------------------------------------------------------------------------
*/

import { useState } from "react";


/*
|--------------------------------------------------------------------------
| ProjectWorkspace Component
|--------------------------------------------------------------------------
|
| project:
|     The project selected by the user.
|
| onBack:
|     Takes the user back to Project Details.
|
|--------------------------------------------------------------------------
*/

const ProjectWorkspace = ({
    project,
    onBack,
}) => {


    /*
    |--------------------------------------------------------------------------
    | Selected File
    |--------------------------------------------------------------------------
    |
    | Eventually this will contain the file selected from
    | the file explorer.
    |
    | Example:
    |
    | "src/App.jsx"
    |
    |--------------------------------------------------------------------------
    */

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | File List
    |--------------------------------------------------------------------------
    |
    | These are temporary files.
    |
    | Later they will come from the backend/database
    | or a connected Git repository.
    |
    |--------------------------------------------------------------------------
    */

    const files = [

        "README.md",

        "package.json",

        "src/App.jsx",

        "src/main.jsx",

        "src/components",

    ];


    /*
    |--------------------------------------------------------------------------
    | Handle File Selection
    |--------------------------------------------------------------------------
    |
    | When the user clicks a file, we save that file
    | in selectedFile state.
    |
    |--------------------------------------------------------------------------
    */

    const handleFileSelect = (file) => {

        setSelectedFile(file);

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

                    <span>
                        DevPilot AI
                    </span>

                </div>

            </header>


            {/* ----------------------------------------------------------
                Main Workspace
            ---------------------------------------------------------- */}

            <main style={styles.workspace}>


                {/* ------------------------------------------------------
                    LEFT PANEL
                    File Explorer
                ------------------------------------------------------ */}

                <aside style={styles.filePanel}>


                    <div style={styles.panelHeader}>

                        <strong>
                            📁 Files
                        </strong>

                    </div>


                    <div style={styles.fileList}>


                        {files.map((file) => (

                            <button

                                key={file}

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

                                {file.startsWith("src/")
                                    ? "📄"
                                    : "📋"}

                                {" "}

                                {file}

                            </button>

                        ))}


                    </div>


                </aside>


                {/* ------------------------------------------------------
                    CENTER PANEL
                    Code Editor
                ------------------------------------------------------ */}

                <section style={styles.editorPanel}>


                    <div style={styles.panelHeader}>


                        {selectedFile ? (

                            <span>
                                📝 {selectedFile}
                            </span>

                        ) : (

                            <span>
                                📝 Code Editor
                            </span>

                        )}


                    </div>


                    <div style={styles.editor}>


                        {selectedFile ? (

                            <>

                                <div style={styles.editorInfo}>

                                    <strong>
                                        {selectedFile}
                                    </strong>

                                </div>


                                <pre style={styles.code}>

{`// DevPilot AI Code Editor

// This is currently a placeholder.

// Later this area will contain a
// real code editor where you can:

// • View source code
// • Edit files
// • Save changes
// • Ask AI about selected code
// • Generate code with AI

`}

                                </pre>

                            </>

                        ) : (

                            <div style={styles.emptyEditor}>

                                <h2>
                                    📝 Select a file
                                </h2>

                                <p>
                                    Choose a file from the explorer
                                    to open it here.
                                </p>

                            </div>

                        )}


                    </div>


                </section>


                {/* ------------------------------------------------------
                    RIGHT PANEL
                    AI Assistant
                ------------------------------------------------------ */}

                <aside style={styles.aiPanel}>


                    <div style={styles.panelHeader}>

                        <strong>
                            🤖 DevPilot AI
                        </strong>

                    </div>


                    <div style={styles.aiContent}>


                        <div style={styles.aiWelcome}>

                            <h3>
                                AI Developer Assistant
                            </h3>

                            <p>
                                Ask questions about your project,
                                code, errors, or architecture.
                            </p>

                        </div>


                        <div style={styles.aiPlaceholder}>

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
| Temporary Workspace Styles
|--------------------------------------------------------------------------
|
| These styles are intentionally simple.
|
| Later we will replace them with:
|
|     Tailwind CSS
|
| and eventually create a more professional IDE-like UI.
|
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

        padding:
            "0 20px",

        backgroundColor:
            "#ffffff",

        borderBottom:
            "1px solid #ddd",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "space-between",

    },


    /*
    Back Button
    */

    backButton: {

        padding:
            "7px 12px",

        marginRight:
            "15px",

        border:
            "1px solid #ccc",

        borderRadius:
            "6px",

        backgroundColor:
            "#ffffff",

        cursor:
            "pointer",

    },


    /*
    Project Name
    */

    projectName: {

        fontWeight:
            "bold",

        fontSize:
            "18px",

    },


    /*
    Header Right
    */

    headerRight: {

        fontWeight:
            "bold",

        color:
            "#2563eb",

    },


    /*
    Main Workspace
    */

    workspace: {

        flex: 1,

        display:
            "grid",

        gridTemplateColumns:
            "220px 1fr 320px",

        overflow:
            "hidden",

    },


    /*
    File Explorer
    */

    filePanel: {

        backgroundColor:
            "#ffffff",

        borderRight:
            "1px solid #ddd",

        display:
            "flex",

        flexDirection:
            "column",

    },


    /*
    Code Editor
    */

    editorPanel: {

        display:
            "flex",

        flexDirection:
            "column",

        backgroundColor:
            "#1e1e1e",

    },


    /*
    AI Panel
    */

    aiPanel: {

        backgroundColor:
            "#ffffff",

        borderLeft:
            "1px solid #ddd",

        display:
            "flex",

        flexDirection:
            "column",

    },


    /*
    Panel Header
    */

    panelHeader: {

        height:
            "45px",

        padding:
            "0 15px",

        display:
            "flex",

        alignItems:
            "center",

        borderBottom:
            "1px solid #ddd",

        backgroundColor:
            "#fafafa",

    },


    /*
    File List
    */

    fileList: {

        padding:
            "10px",

        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "4px",

    },


    /*
    File Button
    */

    fileButton: {

        padding:
            "9px 10px",

        textAlign:
            "left",

        border:
            "none",

        backgroundColor:
            "transparent",

        cursor:
            "pointer",

        borderRadius:
            "5px",

    },


    /*
    Selected File
    */

    selectedFile: {

        padding:
            "9px 10px",

        textAlign:
            "left",

        border:
            "none",

        backgroundColor:
            "#dbeafe",

        color:
            "#1d4ed8",

        cursor:
            "pointer",

        borderRadius:
            "5px",

    },


    /*
    Editor
    */

    editor: {

        flex: 1,

        overflow:
            "auto",

        color:
            "#ffffff",

    },


    /*
    Editor Information
    */

    editorInfo: {

        padding:
            "12px 20px",

        backgroundColor:
            "#252526",

        borderBottom:
            "1px solid #333",

    },


    /*
    Code
    */

    code: {

        padding:
            "20px",

        margin:
            "0",

        fontFamily:
            "Consolas, monospace",

        fontSize:
            "14px",

        lineHeight:
            "1.6",

    },


    /*
    Empty Editor
    */

    emptyEditor: {

        height:
            "100%",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        color:
            "#aaa",

        textAlign:
            "center",

    },


    /*
    AI Content
    */

    aiContent: {

        flex:
            "1",

        padding:
            "15px",

        overflow:
            "auto",

    },


    /*
    AI Welcome
    */

    aiWelcome: {

        padding:
            "15px",

        border:
            "1px solid #ddd",

        borderRadius:
            "8px",

        backgroundColor:
            "#f8fafc",

    },


    /*
    AI Placeholder
    */

    aiPlaceholder: {

        marginTop:
            "20px",

        padding:
            "20px",

        textAlign:
            "center",

        border:
            "1px dashed #bbb",

        borderRadius:
            "8px",

        color:
            "#666",

    },


    /*
    AI Input Area
    */

    aiInputArea: {

        padding:
            "12px",

        borderTop:
            "1px solid #ddd",

        display:
            "flex",

        gap:
            "8px",

    },


    /*
    AI Input
    */

    aiInput: {

        flex:
            "1",

        padding:
            "10px",

        border:
            "1px solid #ccc",

        borderRadius:
            "6px",

        outline:
            "none",

    },


    /*
    Ask Button
    */

    askButton: {

        padding:
            "10px 14px",

        border:
            "none",

        borderRadius:
            "6px",

        backgroundColor:
            "#2563eb",

        color:
            "#ffffff",

        cursor:
            "pointer",

    },

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default ProjectWorkspace;