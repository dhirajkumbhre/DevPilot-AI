/*
|--------------------------------------------------------------------------
| File        : ai.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Handles communication between our backend and the AI model.
|
|--------------------------------------------------------------------------
*/

import OpenAI from "openai";

/*
|--------------------------------------------------------------------------
| OpenAI Client
|--------------------------------------------------------------------------
|
| The API key comes from the server environment.
|
| IMPORTANT:
| Never put this API key inside React/frontend code.
|
|--------------------------------------------------------------------------
*/

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


/*
|--------------------------------------------------------------------------
| Ask AI
|--------------------------------------------------------------------------
|
| Receives:
|
| - user message
| - current file
| - current file content
|
| Returns:
|
| - AI response
|
|--------------------------------------------------------------------------
*/

export const askAIService = async ({
    message,
    fileName,
    fileContent,
}) => {

    /*
    ----------------------------------------------------------------------
    Build the developer context.
    ----------------------------------------------------------------------
    */

    const prompt = `
You are DevPilot AI, an AI-powered developer assistant.

Help the developer understand, debug and improve their code.

Current file:
${fileName || "No file selected"}

Current code:

${fileContent || "No code provided"}

Developer question:

${message}

Instructions:

1. Give a clear and practical answer.
2. Explain the reason behind your answer.
3. If code needs to be changed, show the relevant code.
4. Do not unnecessarily rewrite the entire project.
5. Treat the developer as someone learning full-stack development.
`;


    /*
    ----------------------------------------------------------------------
    Send request to the AI model.
    ----------------------------------------------------------------------
    */

    const response = await openai.responses.create({

        model: "gpt-5-mini",

        input: prompt,

    });


    /*
    ----------------------------------------------------------------------
    Return the generated text.
    ----------------------------------------------------------------------
    */

    return response.output_text;
};