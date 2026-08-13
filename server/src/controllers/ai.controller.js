/*
|--------------------------------------------------------------------------
| File        : ai.controller.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Handles HTTP requests related to the AI assistant.
|
|--------------------------------------------------------------------------
*/

import {
    askAIService,
} from "../services/ai.service.js";


/*
|--------------------------------------------------------------------------
| Ask AI
|--------------------------------------------------------------------------
|
| POST /api/ai/chat
|
|--------------------------------------------------------------------------
*/

export const askAI = async (req, res) => {

    try {

        /*
        ------------------------------------------------------------------
        Get information sent by React.
        ------------------------------------------------------------------
        */

        const {
            message,
            fileName,
            fileContent,
        } = req.body;


        /*
        ------------------------------------------------------------------
        Basic validation.
        ------------------------------------------------------------------
        */

        if (!message) {

            return res.status(400).json({

                success: false,

                message: "Message is required",

            });
        }


        /*
        ------------------------------------------------------------------
        Send request to AI service.
        ------------------------------------------------------------------
        */

        const answer = await askAIService({

            message,

            fileName,

            fileContent,

        });


        /*
        ------------------------------------------------------------------
        Send AI response back to React.
        ------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            data: {

                answer,

            },

        });

    } catch (error) {

        console.error(
            "AI controller error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get response from AI",

        });
    }
};