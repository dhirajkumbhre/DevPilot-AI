/*
|--------------------------------------------------------------------------
| DevPilot AI Service
|--------------------------------------------------------------------------
|
| This service communicates with our locally running Ollama AI.
|
| Flow:
|
| Controller
|     ↓
| AI Service
|     ↓
| Ollama
|     ↓
| Llama 3.2
|
|--------------------------------------------------------------------------
*/

const OLLAMA_URL = "http://localhost:11434/api/chat";

export const generateAIResponse = async (message) => {
    /*
    Send the user's message to Ollama.
    */

    const response = await fetch(OLLAMA_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            model: "llama3.2",

            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],

            stream: false,
        }),
    });

    /*
    If Ollama returns an error,
    stop and report it.
    */

    if (!response.ok) {
        throw new Error("Ollama AI request failed");
    }

    /*
    Convert Ollama's response into JavaScript.
    */

    const data = await response.json();

    /*
    Ollama returns the AI response inside:

    data.message.content
    */

    return data.message.content;
};