/*
|--------------------------------------------------------------------------
| File        : health.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose
| -------
| This file is responsible for communicating with the backend
| Health API.
|
| React components SHOULD NOT directly make HTTP requests.
|
| Instead:
|
| App.jsx
|      │
|      ▼
| health.service.js
|      │
|      ▼
| Axios
|      │
|      ▼
| Express Backend
|
|--------------------------------------------------------------------------
*/

import axios from "axios";

/*
|--------------------------------------------------------------------------
| Backend Base URL
|--------------------------------------------------------------------------
|
| Every API request starts from this URL.
|
| During development:
| http://localhost:5000
|
| Later we'll move this into:
| VITE_API_URL
|
|--------------------------------------------------------------------------
*/

const API_BASE_URL = "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| Create Axios Instance
|--------------------------------------------------------------------------
|
| Instead of writing:
|
| axios.get(...)
| axios.post(...)
| axios.put(...)
|
| everywhere,
|
| we create one reusable Axios object.
|
|--------------------------------------------------------------------------
*/

const api = axios.create({

    baseURL: API_BASE_URL,

    headers: {

        "Content-Type": "application/json"

    },

    timeout: 10000

});

/*
|--------------------------------------------------------------------------
| Function : getBackendHealth
|--------------------------------------------------------------------------
|
| Purpose
| -------
| Sends a GET request to:
|
| GET /api/health
|
| Returns:
|
| {
|    success,
|    project,
|    version,
|    message
| }
|
|--------------------------------------------------------------------------
*/

export async function getBackendHealth() {

    try {

        /*
        --------------------------------------------------------------
        | Send GET Request
        --------------------------------------------------------------
        */

        const response = await api.get("/api/health");

        /*
        --------------------------------------------------------------
        | Return only JSON data
        --------------------------------------------------------------
        */

        return response.data;

    }

    catch (error) {

        /*
        --------------------------------------------------------------
        | Print error for debugging
        --------------------------------------------------------------
        */

        console.error(

            "Health Service Error:",

            error

        );

        /*
        --------------------------------------------------------------
        | Pass error back to App.jsx
        --------------------------------------------------------------
        */

        throw error;

    }

}