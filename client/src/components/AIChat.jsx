/*
|--------------------------------------------------------------------------
| DevPilot AI Chat
|--------------------------------------------------------------------------
|
| AI assistant for the currently selected project and file.
|
*/

import { useState } from "react";

import {
    sendMessageToAI,
} from "../services/ai.service.js";

import "../styles/ai-chat.css";


/*
|--------------------------------------------------------------------------
| AI Chat Component
|--------------------------------------------------------------------------
*/

const AIChat = ({
    projectId,
    fileId,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Messages
    |--------------------------------------------------------------------------
    */

    const [messages, setMessages] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Input
    |--------------------------------------------------------------------------
    */

    const [input, setInput] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Send Prompt
    |--------------------------------------------------------------------------
    |
    | This is the common function used by:
    |
    | - Normal chat
    | - Explain Code
    | - Find Bugs
    |
    |--------------------------------------------------------------------------
    */

    const sendPrompt = async (prompt) => {

        const message = prompt.trim();

        if (
            !message ||
            loading ||
            !projectId ||
            !fileId
        ) {
            return;
        }


        /*
        Add user's message.
        */

        setMessages(
            (previousMessages) => [

                ...previousMessages,

                {
                    role: "user",
                    content: message,
                },

            ]
        );


        setInput("");

        setLoading(true);


        try {

            /*
            Send request to backend.
            */

            const aiResponse =
                await sendMessageToAI({

                    message,

                    projectId,

                    fileId,

                });


            /*
            Add AI response.
            */

            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    {
                        role: "assistant",

                        content:
                            aiResponse,
                    },

                ]
            );


        } catch (error) {

            /*
            Show error inside chat.
            */

            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    {
                        role: "assistant",

                        content:
                            error.message ||
                            "Something went wrong.",
                    },

                ]
            );

        } finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Normal Chat
    |--------------------------------------------------------------------------
    */

    const handleSendMessage =
        async (event) => {

            event.preventDefault();

            const message =
                input.trim();


            if (
                !message ||
                loading ||
                !projectId ||
                !fileId
            ) {
                return;
            }


            await sendPrompt(message);
        };



        /*
|--------------------------------------------------------------------------
| Explain Code
|--------------------------------------------------------------------------
|
| Ask the AI to explain the currently selected file.
|
|--------------------------------------------------------------------------
*/

const handleExplainCode = () => {

    sendPrompt(`

Explain the currently selected file in detail.

Please cover:

1. What this file does.
2. The important functions, components, or variables.
3. How the code works step by step.
4. How this file may connect with the rest of the project.
5. Important concepts a developer should understand.

Use the actual code from the selected file.

Do not invent information that is not present in the file.

    `);
};


/*
|--------------------------------------------------------------------------
| Find Bugs
|--------------------------------------------------------------------------
|
| Ask the AI to inspect the selected file for problems.
|
|--------------------------------------------------------------------------
*/

const handleFindBugs = () => {

    sendPrompt(`

Analyze the currently selected file for bugs and potential problems.

Please carefully inspect the actual code.

Look for:

1. Syntax errors.
2. Logic errors.
3. Runtime errors.
4. Incorrect API usage.
5. Undefined variables or functions.
6. Incorrect React usage if this is a React file.
7. Potential security problems where relevant.
8. Unnecessary or suspicious code.
9. Problems that could cause unexpected behavior.

For every issue you find:

- Explain what is wrong.
- Mention the relevant code or line when possible.
- Explain why it is a problem.
- Suggest a practical fix.

If you do not find any clear bugs, say:

"No obvious bugs found."

Do not invent bugs.

Base your answer only on the actual selected file.

    `);
};


/*
|--------------------------------------------------------------------------
| Improve Code
|--------------------------------------------------------------------------
|
| Ask the AI to suggest practical improvements
| for the currently selected file.
|
|--------------------------------------------------------------------------
*/

const handleImproveCode = () => {

    sendPrompt(`

Analyze the currently selected file and suggest practical
code improvements.

Please inspect the actual code carefully.

Focus on:

1. Code quality.
2. Readability.
3. Maintainability.
4. Performance where relevant.
5. Error handling.
6. Security where relevant.
7. React best practices if this is a React file.
8. JavaScript best practices if applicable.
9. Removing unnecessary or duplicated code.

For every important improvement:

- Explain what should be improved.
- Explain why the improvement is useful.
- Show the suggested code when appropriate.
- Clearly mention where the change should be made.

Important:

- Preserve the existing functionality.
- Do not invent project features.
- Do not invent dependencies.
- Do not rewrite the entire project unnecessarily.
- Base your suggestions only on the actual selected file.

At the end, provide a short prioritized list of the
most important improvements.

    `);
};

/*
|--------------------------------------------------------------------------
| Generate Tests
|--------------------------------------------------------------------------
|
| Ask the AI to generate useful test cases for the
| currently selected file.
|
|--------------------------------------------------------------------------
*/

const handleGenerateTests = () => {

    sendPrompt(`

Analyze the currently selected file and generate
appropriate tests for it.

First understand the actual code in the selected file.

Please provide:

1. What should be tested.
2. Important normal/expected cases.
3. Edge cases.
4. Error or invalid-input cases where relevant.
5. A practical test implementation.

Testing rules:

- Use the actual code from the selected file.
- Do not invent functions, variables, APIs, or dependencies.
- Do not assume a testing library that is not already
  visible in the project context.
- If the project already uses a testing framework,
  use that framework.
- If no testing framework is visible, explain which
  testing approach would be appropriate before showing
  the test code.
- Keep the tests focused on the selected file.
- Explain what each important test verifies.

At the end, provide:

TEST SUMMARY

- Main behavior tested
- Edge cases tested
- Error cases tested
- Any additional tests recommended

    `);
};



/*
|--------------------------------------------------------------------------
| Code Review
|--------------------------------------------------------------------------
|
| Ask the AI to perform a professional review of the
| currently selected file.
|
|--------------------------------------------------------------------------
*/

const handleCodeReview = () => {

    sendPrompt(`

Perform a professional code review of the currently
selected file.

Analyze the actual code carefully.

Review the following areas:

1. Correctness
2. Code quality
3. Readability
4. Maintainability
5. Error handling
6. Security
7. Performance
8. Architecture and design
9. Testing
10. Potential technical debt

For every important issue:

- Give it a severity level.
- Explain what the problem is.
- Explain why it matters.
- Suggest a practical improvement.
- Mention the relevant code or section when possible.

Use these severity levels:

CRITICAL
HIGH
MEDIUM
LOW

Important rules:

- Do not invent problems.
- Do not invent dependencies.
- Do not invent project features.
- Base the review only on the actual selected file.
- Preserve the existing functionality in your recommendations.

Finish with:

OVERALL REVIEW

Strengths:
- List the strongest parts of the code.

Most Important Issues:
- List the most important problems found.

Top Recommendations:
- List the three most valuable improvements.

Testing Recommendations:
- Mention the most useful tests for this file.

`);
};




    /*
    |--------------------------------------------------------------------------
    | User Interface
    |--------------------------------------------------------------------------
    */

    return (

        <section className="ai-chat">


            {/* ==========================================================
                HEADER
            ========================================================== */}

            <div className="ai-chat-header">

                <div className="ai-chat-title">

                    <div className="ai-chat-icon">
                        🚀
                    </div>

                    <div>

                        <h2>
                            DevPilot AI
                        </h2>

                        <p>
                            Your local AI developer assistant
                        </p>

                    </div>

                </div>


                <span className="ai-status">

                    <span
                        className="ai-status-dot"
                    />

                    Llama 3.2

                </span>

            </div>


            {/* ==========================================================
                QUICK ACTIONS
            ========================================================== */}

            <div className="ai-quick-actions">

                <button
                    type="button"
                    onClick={handleExplainCode}
                    disabled={
                        loading ||
                        !projectId ||
                        !fileId
                    }
                >
                    ✨ Explain Code
                </button>


                <button
                    type="button"
                    onClick={handleFindBugs}
                    disabled={
                        loading ||
                        !projectId ||
                        !fileId
                    }
                >
                    🐛 Find Bugs
                </button>

                <button
    type="button"
    onClick={handleImproveCode}
    disabled={
        loading ||
        !projectId ||
        !fileId
    }
>
    🚀 Improve Code
</button>


<button
    type="button"
    onClick={handleGenerateTests}
    disabled={
        loading ||
        !projectId ||
        !fileId
    }
>
    🧪 Generate Tests
</button>



<button
    type="button"
    onClick={handleCodeReview}
    disabled={
        loading ||
        !projectId ||
        !fileId
    }
>
    🔎 Code Review
</button>
            </div>


            {/* ==========================================================
                MESSAGES
            ========================================================== */}

            <div className="ai-messages">

                {messages.length === 0 && (

                    <div className="ai-empty">

                        <div className="ai-empty-icon">
                            ✨
                        </div>

                        <h3>
                            How can I help you?
                        </h3>

                        <p>
                            Select a file and ask DevPilot
                            about your code.
                        </p>

                    </div>

                )}


                {messages.map(
                    (message, index) => (

                        <div
                            key={index}

                            className={
                                message.role === "user"

                                    ? "ai-message ai-message-user"

                                    : "ai-message ai-message-assistant"
                            }
                        >

                            <div
                                className="ai-message-label"
                            >

                                {message.role === "user"
                                    ? "You"
                                    : "DevPilot AI"}

                            </div>


                            <div
                                className="ai-message-content"
                            >

                                {message.content}

                            </div>

                        </div>

                    )
                )}


                {loading && (

                    <div
                        className="ai-message ai-message-assistant"
                    >

                        <div
                            className="ai-message-label"
                        >
                            DevPilot AI
                        </div>


                        <div className="ai-typing">
                            Thinking...
                        </div>

                    </div>

                )}

            </div>


            {/* ==========================================================
                INPUT
            ========================================================== */}

            <form
                className="ai-input-area"

                onSubmit={
                    handleSendMessage
                }
            >

                <input
                    type="text"

                    value={input}

                    onChange={(event) =>
                        setInput(
                            event.target.value
                        )
                    }

                    placeholder={
                        !projectId
                            ? "Select a project first..."
                            : !fileId
                                ? "Select a file first..."
                                : "Ask about this file..."
                    }

                    disabled={
                        loading ||
                        !projectId ||
                        !fileId
                    }
                />


                <button
                    type="submit"

                    disabled={
                        loading ||
                        !input.trim() ||
                        !projectId ||
                        !fileId
                    }
                >

                    {loading
                        ? "..."
                        : "Send →"}

                </button>

            </form>


            {/* ==========================================================
                FOOTER
            ========================================================== */}

            <div className="ai-chat-footer">

                🔒 Runs locally with Ollama

            </div>

        </section>

    );
};


export default AIChat;