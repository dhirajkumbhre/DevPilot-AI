/*
|--------------------------------------------------------------------------
| DevPilot Code Change Preview
|--------------------------------------------------------------------------
|
| Shows an AI-generated change before it is applied.
|
|--------------------------------------------------------------------------
*/

import React from "react";


const CodeChangePreview = ({
    filePath,
    originalCode,
    proposedCode,
    onApply,
    onReject,
}) => {

    if (!proposedCode) {
        return null;
    }


    return (

        <div className="code-change-preview">

            {/* ==========================================================
                HEADER
            ========================================================== */}

            <div className="code-change-header">

                <div>

                    <strong>
                        Proposed Change
                    </strong>

                    <span>
                        {filePath || "Selected file"}
                    </span>

                </div>

            </div>


            {/* ==========================================================
                CURRENT CODE
            ========================================================== */}

            <div className="code-change-section">

                <div className="code-change-section-title">
                    Current Code
                </div>

                <pre className="code-change-code">
                    {originalCode}
                </pre>

            </div>


            {/* ==========================================================
                PROPOSED CODE
            ========================================================== */}

            <div className="code-change-section">

                <div className="code-change-section-title">
                    Proposed Code
                </div>

                <pre className="code-change-code proposed">
                    {proposedCode}
                </pre>

            </div>


            {/* ==========================================================
                ACTIONS
            ========================================================== */}

            <div className="code-change-actions">

                <button
                    type="button"

                    className="code-change-reject"

                    onClick={onReject}
                >
                    Reject
                </button>


                <button
                    type="button"

                    className="code-change-apply"

                    onClick={onApply}
                >
                    Apply Change
                </button>

            </div>

        </div>

    );

};


export default CodeChangePreview;