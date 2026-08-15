/*
|--------------------------------------------------------------------------
| DevPilot AI Service
|--------------------------------------------------------------------------
|
| This service communicates with our locally running Ollama AI.
|
| DevPilot can understand:
|
| 1. The selected project
| 2. The selected file
| 3. The actual code inside that file
|
| Flow:
|
| Controller
|     ↓
| AI Service
|     ↓
| Verify Project Ownership
|     ↓
| Find Selected File
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
|     Developer's question.
|
| projectId
|     Currently opened project.
|
| fileId
|     Currently selected file.
|
| userId
|     Authenticated user's ID.
|
|--------------------------------------------------------------------------
*/

export const generateAIResponse = async ({
    message,
    projectId,
    fileId,
    userId,
}) => {

    /*
    ----------------------------------------------------------------------
    | Project Context
    ----------------------------------------------------------------------
    */

    let projectContext = "";


    /*
    ----------------------------------------------------------------------
    | File Context
    ----------------------------------------------------------------------
    */

    let fileContext = "";


    /*
    ----------------------------------------------------------------------
    | Verify Project
    ----------------------------------------------------------------------
    */

    if (projectId) {

        /*
        --------------------------------------------------------------
        Find project belonging to authenticated user.
        --------------------------------------------------------------
        */

        const project = await Project.findOne({

            _id: projectId,

            owner: userId,

        });


        /*
        --------------------------------------------------------------
        Project not found.
        --------------------------------------------------------------
        */

        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        /*
        --------------------------------------------------------------
        Build project information.
        --------------------------------------------------------------
        */

        projectContext = `
PROJECT INFORMATION
===================

Project Name:
${project.name}

Project Description:
${project.description || "No description provided."}
`;


        /*
        ------------------------------------------------------------------
        | Selected File
        ------------------------------------------------------------------
        */

        if (fileId) {

            /*
            --------------------------------------------------------------
            Find the selected file.
            --------------------------------------------------------------

            IMPORTANT:

            We check BOTH:

            1. fileId
            2. projectId

            This prevents a user from requesting a file
            belonging to another project.
            --------------------------------------------------------------
            */

            const file = await ProjectFile.findOne({

                _id: fileId,

                project: projectId,

            });


            /*
            --------------------------------------------------------------
            File not found.
            --------------------------------------------------------------
            */

            if (!file) {

                throw new Error(
                    "Project file not found"
                );

            }


            /*
            --------------------------------------------------------------
            Build file context.
            --------------------------------------------------------------
            */

            fileContext = `
SELECTED FILE
=============

File Path:
${file.path}

File Content:
--------------------

${file.content || "This file is empty."}

--------------------
`;
        }

    }


    /*
    ----------------------------------------------------------------------
    | Build AI Prompt
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


${fileContext}


DEVELOPER QUESTION
==================

${message}


IMPORTANT INSTRUCTIONS
======================

1. Use the provided project information when
   answering project-related questions.

2. If a selected file is provided, use its
   actual content when answering questions
   about that file.

3. Do NOT invent files, functions, variables,
   technologies, or project features that are
   not present in the provided context.

4. If the developer asks about the selected file,
   base your answer on the actual file content.

5. If the information required to answer the
   question is not available, clearly say so.

6. When explaining code, mention the file path
   when possible.

7. When finding a bug, explain:
   - what the problem is
   - why it happens
   - how to fix it

8. When providing code changes, clearly explain
   where the code should be placed.

9. Keep the answer practical and developer-focused.

`;


    /*
    ----------------------------------------------------------------------
    | Send Request To Ollama
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
                            "You are DevPilot AI, a helpful software development assistant that understands project code provided in the context.",
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
    | Handle Ollama Error
    ----------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            "Ollama AI request failed"
        );

    }


    /*
    ----------------------------------------------------------------------
    | Convert Ollama Response
    ----------------------------------------------------------------------
    */

    const data =
        await response.json();


    /*
    ----------------------------------------------------------------------
    | Return AI Response
    ----------------------------------------------------------------------
    */

    return data.message.content;

};