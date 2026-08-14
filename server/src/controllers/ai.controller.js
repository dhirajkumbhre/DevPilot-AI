/*
|--------------------------------------------------------------------------
| DevPilot AI Controller
|--------------------------------------------------------------------------
|
| The controller receives the HTTP request from the frontend
| and passes the user's message to the AI service.
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
|     "message": "Explain JWT authentication"
| }
|
|--------------------------------------------------------------------------
*/

export const chatWithAI = async (req, res) => {
    try {
        /*
        Get the user's message from the request body.
        */

        const { message } = req.body;

        /*
        Basic validation.
        */

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        /*
        Send the message to our AI service.
        */

        const aiResponse = await generateAIResponse(message);

        /*
        Return the AI response to the frontend.
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
        Log the actual error in the backend terminal.
        */

        console.error(
            "AI controller error:",
            error.message
        );

        /*
        Send a safe error to the frontend.
        */

        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
        });
    }
};