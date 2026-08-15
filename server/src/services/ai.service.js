/*
|--------------------------------------------------------------------------
| DevPilot AI Service
|--------------------------------------------------------------------------
|
| This service communicates with our locally running Ollama AI.
|
| DevPilot can also read the files belonging to the selected project.
|
| Flow:
|
| Controller
|     ↓
| AI Service
|     ↓
| Verify Project Ownership
|     ↓
| Load Project Files
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
import ProjectFile from "../models/projectFile.model.js";


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
| userId
|     The authenticated user's ID.
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
    If a project was selected
    ----------------------------------------------------------------------
    */

    if (projectId) {

        /*
        --------------------------------------------------------------
        Verify that the project belongs to the logged-in user.
        --------------------------------------------------------------
        */

        const project = await Project.findOne({

            _id: projectId,

            owner: userId,

        });


        /*
        Project doesn't exist or doesn't belong
        to the authenticated user.
        */

        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        /*
        --------------------------------------------------------------
        Load project files
        --------------------------------------------------------------
        */

        const projectFiles =
            await ProjectFile.find({

                project: projectId,

            })
            .select("path content")
            .sort({
                path: 1,
            });


        /*
        --------------------------------------------------------------
        Convert files into AI-readable context
        --------------------------------------------------------------
        */

        const filesContext =
            projectFiles
                .map((file) => {

                    return `
==================================================
FILE: ${file.path}
==================================================

${file.content}
`;

                })
                .join("\n");


        /*
        --------------------------------------------------------------
        Build complete project context
        --------------------------------------------------------------
        */

        projectContext = `

PROJECT INFORMATION
===================

Project Name:
${project.name}

Project Description:
${project.description || "No description provided."}


PROJECT FILES
=============

${filesContext || "No project files found."}

`;
    }


    /*
    ----------------------------------------------------------------------
    Build AI Prompt
    ----------------------------------------------------------------------
    */

    const prompt = `

You are DevPilot AI.

You are an AI-powered software development assistant.

Your job is to help developers:

- understand their projects
- understand their code
- debug problems
- explain architecture
- improve code
- write code
- review code
- suggest improvements


${projectContext}


DEVELOPER QUESTION
==================

${message}


IMPORTANT INSTRUCTIONS
======================

1. Use the provided project information and files
   when answering project-related questions.

2. If the developer asks about their code,
   base your answer on the actual project files
   provided above.

3. Do NOT invent files, functions, variables,
   technologies, or project features that are
   not present in the provided context.

4. If the information needed to answer the question
   is not available in the provided project files,
   clearly say that the relevant information
   is not available.

5. Give practical developer-focused answers.

6. When explaining code, mention the relevant
   file path when possible.

7. When providing code, clearly explain where
   the code should be placed.

`;


    /*
    ----------------------------------------------------------------------
    Send request to Ollama
    ----------------------------------------------------------------------
    */

    const response = await fetch(
        OLLAMA_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

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
    Handle Ollama errors
    ----------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            "Ollama AI request failed"
        );

    }


    /*
    ----------------------------------------------------------------------
    Convert Ollama response
    ----------------------------------------------------------------------
    */

    const data =
        await response.json();


    /*
    ----------------------------------------------------------------------
    Return AI response
    ----------------------------------------------------------------------
    */

    return data.message.content;

};