/*
|--------------------------------------------------------------------------
| DevPilot AI Frontend Service
|--------------------------------------------------------------------------
|
| Communicates with the DevPilot AI backend.
|
| Flow:
|
| AIChat.jsx
|     ↓
| ai.service.js
|     ↓
| POST /api/ai/chat
|     ↓
| Express
|     ↓
| Ollama
|
|--------------------------------------------------------------------------
*/

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/ai`;

/*
|--------------------------------------------------------------------------
| Send Message To AI
|--------------------------------------------------------------------------
|
| Sends:
|
| - user's message
| - selected project ID
| - selected file ID
| - authentication token
|
|--------------------------------------------------------------------------
*/

export const sendMessageToAI = async ({
    message,
    projectId,
    fileId,
}) => {

    /*
    ----------------------------------------------------------------------
    Get JWT from localStorage.
    ----------------------------------------------------------------------
    */

    const token =
        localStorage.getItem("token");


    /*
    ----------------------------------------------------------------------
    Send request to backend.
    ----------------------------------------------------------------------
    */

    const response = await fetch(
        `${API_URL}/chat`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,
            },

            body: JSON.stringify({

                message,

                projectId,

                fileId,

            }),
        }
    );


    /*
    ----------------------------------------------------------------------
    Convert backend response.
    ----------------------------------------------------------------------
    */

    const responseData =
        await response.json();


    /*
    ----------------------------------------------------------------------
    Handle backend errors.
    ----------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            responseData.message ||
            "AI request failed"
        );

    }


    /*
    ----------------------------------------------------------------------
    Return only the AI response.
    ----------------------------------------------------------------------
    */

    return responseData.data.response;
};