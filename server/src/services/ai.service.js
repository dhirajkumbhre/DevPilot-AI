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
    |--------------------------------------------------------------------------
    | Project Context
    |--------------------------------------------------------------------------
    */

    let projectContext = "";


    /*
    |--------------------------------------------------------------------------
    | File Context
    |--------------------------------------------------------------------------
    */

    let fileContext = "";


    /*
    |--------------------------------------------------------------------------
    | Verify Project
    |--------------------------------------------------------------------------
    */

    if (projectId) {

        /*
        ----------------------------------------------------------------------
        Find project belonging to authenticated user.
        ----------------------------------------------------------------------
        */

        const project = await Project.findOne({

            _id: projectId,

            owner: userId,

        });


        /*
        ----------------------------------------------------------------------
        Project not found.
        ----------------------------------------------------------------------
        */

        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        /*
        ----------------------------------------------------------------------
        Build project information.
        ----------------------------------------------------------------------
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
        |--------------------------------------------------------------------------
        | Selected File
        |--------------------------------------------------------------------------
        */

        if (fileId) {

            /*
            ------------------------------------------------------------------
            Find selected file.

            IMPORTANT:

            We check both fileId and projectId.

            This prevents a user from requesting a file
            belonging to another project.
            ------------------------------------------------------------------
            */

            const file = await ProjectFile.findOne({

                _id: fileId,

                project: projectId,

            });


            /*
            ------------------------------------------------------------------
            File not found.
            ------------------------------------------------------------------
            */

            if (!file) {

                throw new Error(
                    "Project file not found"
                );

            }


            /*
            ------------------------------------------------------------------
            Build file context.
            ------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | Build AI Prompt
    |--------------------------------------------------------------------------
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
- understand errors
- suggest useful tests


${projectContext}


${fileContext}


DEVELOPER QUESTION
==================

${message}


IMPORTANT GENERAL RULES
=======================

1. Use the provided project information when answering
   project-related questions.

2. If a selected file is provided, use its actual content
   when answering questions about that file.

3. Base technical claims on the code and information
   actually provided in the context.

4. Do NOT invent files, functions, variables, components,
   dependencies, technologies, APIs, or project features
   that are not present in the provided context.

5. If information required to answer the question is not
   available, clearly say that it is not available.

6. When explaining code, mention the relevant file path
   when possible.

7. When finding a bug, explain:
   - what the problem is
   - why it happens
   - how to fix it

8. When providing code changes, clearly explain where
   the code should be placed.

9. Keep answers practical and developer-focused.

10. Prefer accurate answers over long answers.

11. Do not create problems simply to make an answer
    appear more detailed.


CODE REVIEW RULES
=================

When the developer asks for a code review:

1. Review ONLY the code provided in the selected file.

2. Before reporting a problem, verify that the problem
   actually exists in the provided code.

3. NEVER claim that an import, function, variable,
   component, dependency, or feature is missing if it
   already exists in the provided code.

4. NEVER recommend replacing code with code that is
   already being used correctly.

5. Do not invent runtime behavior that cannot be determined
   from the provided code.

6. Do not report theoretical security vulnerabilities
   unless there is actual code in the file that creates
   the vulnerability.

7. Do not recommend SSR, database changes, architecture
   changes, or other technologies unless they are relevant
   to an actual problem in the provided code.

8. Do not report an issue merely because an alternative
   implementation exists.

9. Normal React patterns should NOT automatically be
   considered bugs.

10. Verify React APIs carefully before reporting an issue.

11. For example, do NOT report ReactDOM.createRoot as
    ReactDOM.render.

12. If you cannot prove that an issue exists from the
    provided code, do NOT report it as a bug.

13. Prefer fewer accurate findings over many speculative
    findings.

14. Every reported issue must include evidence from the
    actual code.

15. If possible, mention the relevant line or code section.

16. Distinguish between:

    - Actual Bug
    - Potential Risk
    - Improvement
    - Style Suggestion

17. If the code is already correct, clearly say that.

18. Do not invent missing imports when the import exists.

19. Do not claim a function is being used when the provided
    code shows that it is not being used.

20. Do not recommend fixing something that is already fixed
    in the provided code.


CODE REVIEW RESPONSE FORMAT
===========================

When performing a code review, use this structure:

CODE REVIEW

File:
[actual file path]

Overall Assessment:
[short assessment of the provided code]


CRITICAL
========
[List only actual critical problems.]

If none:
None


HIGH
====
[List only actual high-severity problems.]

If none:
None


MEDIUM
======
[List only actual medium-severity problems.]

If none:
None


LOW
===
[List only actual low-severity problems.]

If none:
None


IMPROVEMENTS
============

1. [Useful improvement]

2. [Useful improvement]

3. [Useful improvement]


STRENGTHS
=========

1. [Actual strength]

2. [Actual strength]


TESTING RECOMMENDATIONS
=======================

1. [Useful test]

2. [Useful test]


IMPORTANT CODE REVIEW BEHAVIOR
==============================

If there are no meaningful bugs:

Say that the code has no obvious bugs based on the
provided file.

Do NOT invent issues.

If something is only a possible improvement, label it
as an improvement instead of calling it a bug.

If something cannot be determined from the provided
file, explicitly say that it cannot be determined.

Always prioritize correctness over the number of findings.

`;


    /*
    |--------------------------------------------------------------------------
    | Send Request To Ollama
    |--------------------------------------------------------------------------
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
                            `
You are DevPilot AI.

You are a careful software development assistant.

You must analyze only the code and project context
provided by the user.

Never invent bugs.

Never claim something is missing when it is present
in the provided code.

Never report a theoretical issue as an actual bug.

Accuracy is more important than the number of findings.
                            `.trim(),

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
    |--------------------------------------------------------------------------
    | Handle Ollama Error
    |--------------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            "Ollama AI request failed"
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Convert Ollama Response
    |--------------------------------------------------------------------------
    */

    const data =
        await response.json();


    /*
    |--------------------------------------------------------------------------
    | Validate Ollama Response
    |--------------------------------------------------------------------------
    */

    if (
        !data.message ||
        !data.message.content
    ) {

        throw new Error(
            "Invalid response received from Ollama"
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Return AI Response
    |--------------------------------------------------------------------------
    */

    return data.message.content;

};