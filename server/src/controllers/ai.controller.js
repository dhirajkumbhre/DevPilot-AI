/*
|--------------------------------------------------------------------------
| DevPilot AI Controller
|--------------------------------------------------------------------------
|
| The controller receives the HTTP request from the frontend
| and passes the user's message + project context to the AI service.
|
| Flow:
|
| React
|   ↓
| /api/ai/chat
|   ↓
| ai.controller.js
|   ↓
| ai.service.js
|   ↓
| MongoDB Project
|   ↓
| Ollama
|
|--------------------------------------------------------------------------
*/

import { generateAIResponse } from "../services/ai.service.js";

/*
|--------------------------------------------------------------------------
| Chat With AI
|--------------------------------------------------------------------------
|
| POST /api/ai/chat
|
| Expected request:
|
| {
|     "message": "What should I improve?",
|     "projectId": "..."
| }
|
|--------------------------------------------------------------------------
*/

export const chatWithAI = async (req, res) => {

    try {

        /*
        ------------------------------------------------------------------
        Get data from the request body.
        ------------------------------------------------------------------

        message:
            The question asked by the user.

        projectId:
            The project that the user wants the AI to understand.
        ------------------------------------------------------------------
        */

        const {
            message,
            projectId
        } = req.body;


        /*
        ------------------------------------------------------------------
        Basic message validation.
        ------------------------------------------------------------------
        */

        if (!message || !message.trim()) {

            return res.status(400).json({

                success: false,

                message: "Message is required",

            });
        }


        /*
        ------------------------------------------------------------------
        Send the message and project ID to the AI service.
        ------------------------------------------------------------------

        The service will eventually:

        1. Find the project.
        2. Read project information.
        3. Build AI context.
        4. Send the context + question to Ollama.
        5. Return the AI response.
        ------------------------------------------------------------------
        */

        const aiResponse = await generateAIResponse({

            message,

            projectId,

            userId:req.user.userId,

        });


        /*
        ------------------------------------------------------------------
        Return the AI response to the frontend.
        ------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message: "AI response generated successfully",

            data: {

                response: aiResponse,

            },

        });

    } catch (error) {

        /*
        ------------------------------------------------------------------
        Log the actual error in the backend terminal.
        ------------------------------------------------------------------
        */

        console.error(
            "AI controller error:",
            error.message
        );


        /*
        ------------------------------------------------------------------
        Send a safe error to the frontend.
        ------------------------------------------------------------------
        */

        return res.status(500).json({

            success: false,

            message: "Failed to generate AI response",

        });

    }

};