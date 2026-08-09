/*
--------------------------------------------------------------
| Authentication Service
--------------------------------------------------------------
|
| This file is responsible for communicating with our
| backend authentication API.
|
| We keep API calls here instead of putting fetch() directly
| inside our React components.
|
--------------------------------------------------------------
*/

// Backend authentication API
const API_URL = "http://localhost:5000/api/auth";

/*
--------------------------------------------------------------
| Register User
--------------------------------------------------------------
|
| Sends the user's registration information to the backend.
|
| POST /api/auth/register
|
--------------------------------------------------------------
*/

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",

        // Tell the backend that we are sending JSON.
        headers: {
            "Content-Type": "application/json",
        },

        // Convert JavaScript object into JSON.
        body: JSON.stringify(userData),
    });

    // Convert backend response from JSON to JavaScript.
    const data = await response.json();

    // If backend returns an error status, throw an error.
    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

/*
--------------------------------------------------------------
| Login User
--------------------------------------------------------------
|
| Sends login credentials to the backend.
|
| POST /api/auth/login
|
| The backend will return:
|
| - user information
| - JWT token
|
--------------------------------------------------------------
*/

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        // Tell Express that the request body is JSON.
        headers: {
            "Content-Type": "application/json",
        },

        // Convert login information into JSON.
        body: JSON.stringify(credentials),
    });

    // Read the backend response.
    const data = await response.json();

    // Handle errors returned by the backend.
    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    // Return the successful login response.
    return data;
};