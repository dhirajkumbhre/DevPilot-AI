/*
|--------------------------------------------------------------------------
| DevPilot AI Service
|--------------------------------------------------------------------------
|
| This service communicates with our locally running Ollama AI.
|
| It also retrieves project information from MongoDB so that
| DevPilot AI can understand which project the user is asking about.
|
| Flow:
|
| Controller
|     ↓
| AI Service
|     ↓
| MongoDB Project
|     ↓
| Build AI Context
|     ↓
| Ollama
|     ↓
| Llama 3.2
|
|--------------------------------------------------------------------------
*/

import Project from "../models/project.model.js";


const OLLAMA_URL =
    "http://localhost:11434/api/chat";


/*
|--------------------------------------------------------------------------
| Generate AI Response
|--------------------------------------------------------------------------
|
| Receives:
|
| message
|     The user's question.
|
| projectId
|     The currently selected project.
|
|--------------------------------------------------------------------------
*/

export const generateAIResponse = async ({
    message,
    projectId,
    userId,
}) => {

    /*
    ----------------------------------------------------------------------
    Project Context
    ----------------------------------------------------------------------
    */

    let projectContext = "";


    /*
    ----------------------------------------------------------------------
    If a project ID was provided, retrieve the project.
    ----------------------------------------------------------------------
    */

    if (projectId) {

        /*
        IMPORTANT:
        We check BOTH project ID and owner.

        This prevents User A from asking the AI about
        User B's project by manually changing the project ID.
        */

        const project = await Project.findOne({

            _id: projectId,

            owner: userId,

        });


        /*
        If the project doesn't exist or doesn't belong
        to the authenticated user, stop the request.
        */

        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        /*
        Build information that will be given to the AI.
        */

        projectContext = `
Project Information:

Project Name:
${project.name}

Project Description:
${project.description || "No description provided."}
`;
    }


    /*
    ----------------------------------------------------------------------
    Build AI Prompt
    ----------------------------------------------------------------------
    */

    const prompt = `
You are DevPilot AI, an AI-powered developer assistant.

Your job is to help developers understand, build,
debug and improve their software projects.

${projectContext}

Developer Question:
${message}

Instructions:

1. Answer the developer's question clearly.
2. Use the project information when it is relevant.
3. Do not invent project details that were not provided.
4. If you need more information, clearly say what information is missing.
5. Give practical explanations suitable for a developer.
6. If code is requested, provide useful code examples.
`;


    /*
    ----------------------------------------------------------------------
    Send request to Ollama.
    ----------------------------------------------------------------------
    */

    const response = await fetch(
        OLLAMA_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({

                model: "llama3.2",

                messages: [

                    {
                        role: "system",

                        content:
                            "You are DevPilot AI, a helpful software development assistant.",
                    },

                    {
                        role: "user",

                        content: prompt,
                    },

                ],

                stream: false,

            }),
        }
    );


    /*
    ----------------------------------------------------------------------
    Handle Ollama errors.
    ----------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            "Ollama AI request failed"
        );

    }


    /*
    ----------------------------------------------------------------------
    Convert Ollama response to JavaScript.
    ----------------------------------------------------------------------
    */

    const data =
        await response.json();


    /*
    ----------------------------------------------------------------------
    Return AI response.
    ----------------------------------------------------------------------
    */

    return data.message.content;
};