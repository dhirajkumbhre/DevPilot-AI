/*
|--------------------------------------------------------------------------
| File        : health.service.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose
| -------
| This service communicates with the backend health endpoint.
|
| React components should never know HOW an API request is made.
| They simply call this service and receive data.
|
|--------------------------------------------------------------------------
*/

import axios from "axios";

/*
|--------------------------------------------------------------------------
| Backend Base URL
|--------------------------------------------------------------------------
|
| Every request in development starts from this address.
|
| Later we will move this into an environment variable.
|
|--------------------------------------------------------------------------
*/

const API_URL = "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| Check Backend Health
|--------------------------------------------------------------------------
|
| Sends:
|     GET /api/health
|
| Returns:
|     Backend health information
|
|--------------------------------------------------------------------------
*/

export const getBackendHealth = async () => {

    const response = await axios.get(`${API_URL}/api/health`);

    return response.data;

};