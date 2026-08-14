/*
|--------------------------------------------------------------------------
| DevPilot AI Chat
|--------------------------------------------------------------------------
|
| Provides the user interface for communicating with
| the local Llama 3.2 AI model.
|
|--------------------------------------------------------------------------
*/

import { useState } from "react";

import { sendMessageToAI } from "../services/ai.service.js";

import "../styles/ai-chat.css";

/*
|--------------------------------------------------------------------------
| AI Chat Component
|--------------------------------------------------------------------------
*/

const AIChat = () => {
    /*
    ----------------------------------------------------------
    Messages
    ----------------------------------------------------------
    */

    const [messages, setMessages] = useState([]);

    /*
    ----------------------------------------------------------
    Current Input
    ----------------------------------------------------------
    */

    const [input, setInput] = useState("");

    /*
    ----------------------------------------------------------
    Loading State
    ----------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    /*
    ----------------------------------------------------------
    Send Message
    ----------------------------------------------------------
    */

    const handleSendMessage = async (event) => {
        event.preventDefault();

        /*
        Ignore empty messages.
        */

        const message = input.trim();

        if (!message || loading) {
            return;
        }

        /*
        Add user's message immediately to the chat.
        */

        setMessages((previousMessages) => [
            ...previousMessages,

            {
                role: "user",
                content: message,
            },
        ]);

        /*
        Clear input box.
        */

        setInput("");

        /*
        Start loading.
        */

        setLoading(true);

        try {
            /*
            Send message to backend.
            */

            const aiResponse = await sendMessageToAI(message);

            /*
            Add AI response to chat.
            */

            setMessages((previousMessages) => [
                ...previousMessages,

                {
                    role: "assistant",
                    content: aiResponse,
                },
            ]);

        } catch (error) {
            /*
            Show error inside chat.
            */

            setMessages((previousMessages) => [
                ...previousMessages,

                {
                    role: "assistant",
                    content:
                        error.message ||
                        "Something went wrong while contacting the AI.",
                },
            ]);

        } finally {
            /*
            Stop loading.
            */

            setLoading(false);
        }
    };

    /*
    ----------------------------------------------------------
    User Interface
    ----------------------------------------------------------
    */

    return (
        <section className="ai-chat">

            {/* --------------------------------------------------
                Header
            -------------------------------------------------- */}

            <div className="ai-chat-header">

                <div>
                    <span className="ai-chat-icon">
                        🚀
                    </span>

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
                    <span className="ai-status-dot"></span>
                    Llama 3.2
                </span>

            </div>


            {/* --------------------------------------------------
                Messages
            -------------------------------------------------- */}

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
                            Ask me about your code, debugging,
                            JavaScript, React, Node.js or anything
                            related to development.
                        </p>

                    </div>

                )}


                {messages.map((message, index) => (

                    <div
                        key={index}
                        className={`ai-message ${
                            message.role === "user"
                                ? "ai-message-user"
                                : "ai-message-assistant"
                        }`}
                    >

                        <div className="ai-message-label">

                            {message.role === "user"
                                ? "You"
                                : "DevPilot AI"}

                        </div>

                        <div className="ai-message-content">
                            {message.content}
                        </div>

                    </div>

                ))}


                {loading && (

                    <div className="ai-message ai-message-assistant">

                        <div className="ai-message-label">
                            DevPilot AI
                        </div>

                        <div className="ai-typing">
                            Thinking...
                        </div>

                    </div>

                )}

            </div>


            {/* --------------------------------------------------
                Input
            -------------------------------------------------- */}

            <form
                className="ai-input-area"
                onSubmit={handleSendMessage}
            >

                <input
                    type="text"
                    value={input}
                    onChange={(event) =>
                        setInput(event.target.value)
                    }
                    placeholder="Ask DevPilot AI anything..."
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !input.trim()
                    }
                >
                    {loading
                        ? "..."
                        : "Send →"}
                </button>

            </form>


            {/* --------------------------------------------------
                Footer
            -------------------------------------------------- */}

            <div className="ai-chat-footer">

                🔒 Runs locally with Ollama •
                Your prompts stay on your machine

            </div>

        </section>
    );
};

export default AIChat;