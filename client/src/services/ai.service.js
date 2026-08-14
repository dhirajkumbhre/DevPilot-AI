/*
|--------------------------------------------------------------------------
| DevPilot AI Frontend Service
|--------------------------------------------------------------------------
|
| This file communicates with our Express backend.
|
| React component
|      ↓
| ai.service.js
|      ↓
| POST /api/ai/chat
|      ↓
| Express
|      ↓
| Ollama
|
|--------------------------------------------------------------------------
*/

const API_URL = "http://localhost:5000/api/ai";

/*
|--------------------------------------------------------------------------
| Send Message To AI
|--------------------------------------------------------------------------
|
| Sends the user's message to the backend AI endpoint.
|
|--------------------------------------------------------------------------
*/

export const sendMessageToAI = async (message) => {
    /*
    Send request to our Express backend.
    */

    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            message,
        }),
    });

    /*
    Convert backend response into JavaScript.
    */

    const responseData = await response.json();

    /*
    Handle backend errors.
    */

    if (!response.ok) {
        throw new Error(
            responseData.message || "AI request failed"
        );
    }

    /*
    Backend response:

    {
        success: true,
        message: "...",
        data: {
            response: "..."
        }
    }

    We only return the actual AI response.
    */

    return responseData.data.response;
};