/*
|--------------------------------------------------------------------------
| File        : ai.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Communicates with the backend AI API.
|
|--------------------------------------------------------------------------
*/

const API_URL =
    "http://localhost:5000/api/ai";


/*
|--------------------------------------------------------------------------
| Ask AI
|--------------------------------------------------------------------------
*/

export const askAI = async ({
    message,
    fileName,
    fileContent,
}) => {

    const token =
        localStorage.getItem("token");


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

                fileName,

                fileContent,

            }),

        }
    );


    const responseData =
        await response.json();


    if (!response.ok) {

        throw new Error(

            responseData.message ||
            "AI request failed"

        );

    }


    return responseData.data;
};