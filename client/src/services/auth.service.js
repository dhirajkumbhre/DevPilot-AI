/*
|--------------------------------------------------------------------------
| Authentication Service
|--------------------------------------------------------------------------
|
| This file is responsible for communicating with the backend
| authentication API.
|
| React components should NOT directly contain fetch() logic.
|
| Instead:
|
| Login.jsx
|    ↓
| AuthContext
|    ↓
| auth.service.js
|    ↓
| Backend API
|
|--------------------------------------------------------------------------
*/


// Backend authentication API base URL.
//
// Our Express server runs on port 5000.
//
// Authentication routes:
// POST /api/auth/register
// POST /api/auth/login
const API_URL = "http://localhost:5000/api/auth";


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
|
| Sends a new user's information to the backend.
|
| Endpoint:
|
| POST /api/auth/register
|
|--------------------------------------------------------------------------
*/

export const registerUser = async (userData) => {

    /*
    Send registration request to Express.
    */

    const response = await fetch(`${API_URL}/register`, {

        // We are creating a new user.
        method: "POST",

        /*
        Tell Express that the request body contains JSON.
        */

        headers: {
            "Content-Type": "application/json",
        },

        /*
        Convert the JavaScript object into JSON.
        */

        body: JSON.stringify(userData),
    });


    /*
    Convert the backend JSON response into a
    JavaScript object.
    */

    const responseData = await response.json();


    /*
    If the backend returns an HTTP error
    such as 400 or 500, stop here.
    */

    if (!response.ok) {

        throw new Error(
            responseData.message || "Registration failed"
        );
    }


    /*
    Our backend response has this structure:
    
    {
        success: true,
        message: "...",
        data: {
            user: {...},
            token: "..."
        }
    }

    We only need the actual authentication data
    for the frontend.

    Therefore return:

    {
        user: {...},
        token: "..."
    }
    */

    return responseData.data;
};


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
|
| Sends email and password to the backend.
|
| Endpoint:
|
| POST /api/auth/login
|
|--------------------------------------------------------------------------
*/

export const loginUser = async (credentials) => {

    /*
    Send login request to Express.
    */

    const response = await fetch(`${API_URL}/login`, {

        // Login uses POST because we are sending credentials.
        method: "POST",

        /*
        Tell Express that we are sending JSON.
        */

        headers: {
            "Content-Type": "application/json",
        },

        /*
        Convert:

        {
            email,
            password
        }

        into JSON before sending it.
        */

        body: JSON.stringify(credentials),
    });


    /*
    Read the backend response.

    Example:

    {
        success: true,
        message: "Login successful",
        data: {
            user: {...},
            token: "JWT..."
        }
    }
    */

    const responseData = await response.json();


    /*
    If login failed, throw an error.

    AuthContext/Login.jsx can then catch
    this error and display it to the user.
    */

    if (!response.ok) {

        throw new Error(
            responseData.message || "Login failed"
        );
    }


    /*
    IMPORTANT:
    
    The backend wraps the actual login information
    inside the "data" property.

    Backend response:

    responseData
        ↓
        data
        ↓
        ├── user
        └── token

    AuthContext expects:

    {
        user,
        token
    }

    Therefore we return responseData.data.
    */

    return responseData.data;
};