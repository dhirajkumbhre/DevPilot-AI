/*
|--------------------------------------------------------------------------
| DevPilot AI Chat
|--------------------------------------------------------------------------
|
| AI assistant for the currently selected project.
|
|--------------------------------------------------------------------------
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
|
| Props:
|
| projectId
|     ID of the currently selected project.
|
|--------------------------------------------------------------------------
*/

const AIChat = ({ projectId }) => {

    /*
    ----------------------------------------------------------------------
    Messages
    ----------------------------------------------------------------------
    */

    const [messages, setMessages] =
        useState([]);


    /*
    ----------------------------------------------------------------------
    Input
    ----------------------------------------------------------------------
    */

    const [input, setInput] =
        useState("");


    /*
    ----------------------------------------------------------------------
    Loading
    ----------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(false);


    /*
    ----------------------------------------------------------------------
    Send Message
    ----------------------------------------------------------------------
    */

    const handleSendMessage =
        async (event) => {

            event.preventDefault();


            /*
            Get cleaned message.
            */

            const message =
                input.trim();


            /*
            Don't send empty messages.
            */

            if (
                !message ||
                loading
            ) {
                return;
            }


            /*
            ------------------------------------------------------------------
            Add user's message to the UI immediately.
            ------------------------------------------------------------------
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


            /*
            Clear input.
            */

            setInput("");


            /*
            Start loading.
            */

            setLoading(true);


            try {

                /*
                ----------------------------------------------------------------
                Send message + project ID to backend.
                ----------------------------------------------------------------
                */

                const aiResponse =
                    await sendMessageToAI({

                        message,

                        projectId,

                    });


                /*
                ----------------------------------------------------------------
                Add AI response.
                ----------------------------------------------------------------
                */

                setMessages(
                    (previousMessages) => [

                        ...previousMessages,

                        {
                            role:
                                "assistant",

                            content:
                                aiResponse,
                        },

                    ]
                );

            } catch (error) {

                /*
                ----------------------------------------------------------------
                Show error.
                ----------------------------------------------------------------
                */

                setMessages(
                    (previousMessages) => [

                        ...previousMessages,

                        {
                            role:
                                "assistant",

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
    | User Interface
    |--------------------------------------------------------------------------
    */

    return (

        <section className="ai-chat">


            {/* --------------------------------------------------------------
                Header
            -------------------------------------------------------------- */}

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


            {/* --------------------------------------------------------------
                Messages
            -------------------------------------------------------------- */}

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
                            Ask me about this project,
                            your code, debugging,
                            React, Node.js or JavaScript.
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


            {/* --------------------------------------------------------------
                Input
            -------------------------------------------------------------- */}

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
                        projectId
                            ? "Ask about this project..."
                            : "Select a project first..."
                    }

                    disabled={
                        loading ||
                        !projectId
                    }
                />


                <button
                    type="submit"

                    disabled={
                        loading ||
                        !input.trim() ||
                        !projectId
                    }
                >

                    {loading
                        ? "..."
                        : "Send →"}

                </button>

            </form>


            {/* --------------------------------------------------------------
                Footer
            -------------------------------------------------------------- */}

            <div className="ai-chat-footer">

                🔒 Runs locally with Ollama

            </div>

        </section>

    );
};


export default AIChat;