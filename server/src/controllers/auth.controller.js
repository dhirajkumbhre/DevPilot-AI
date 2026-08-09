/*
|--------------------------------------------------------------------------
| File        : auth.controller.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Handles HTTP requests related to user authentication.
|
| The controller sits between the route and service layer.
|
| Route
|   ↓
| Controller
|   ↓
| Service
|   ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

import {
    registerUserService,
    loginUserService
} from "../services/auth.service.js";


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
|
| POST /api/auth/register
|
| Responsibilities:
|
| 1. Receive data from the HTTP request.
| 2. Perform basic request validation.
| 3. Call the authentication service.
| 4. Return the service result to the client.
|
| The controller does NOT contain password hashing or
| database logic. That belongs in auth.service.js.
|--------------------------------------------------------------------------
*/

export const registerUser = async (req, res) => {

    try {

        /*
        --------------------------------------------------------------
        Get User Data
        --------------------------------------------------------------

        req.body contains the JSON sent by the client.

        Example:

        {
            "name": "Dhiraj",
            "email": "dhiraj@example.com",
            "password": "password123"
        }
        --------------------------------------------------------------
        */

        const {
            name,
            email,
            password
        } = req.body;


        /*
        --------------------------------------------------------------
        Basic Validation
        --------------------------------------------------------------

        Make sure all required fields were provided before
        sending the data to the service layer.
        --------------------------------------------------------------
        */

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required"

            });
        }


        /*
        --------------------------------------------------------------
        Password Length Validation
        --------------------------------------------------------------

        We don't want extremely short passwords.

        More advanced password rules can be added later.
        --------------------------------------------------------------
        */

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });
        }


        /*
        --------------------------------------------------------------
        Call Authentication Service
        --------------------------------------------------------------

        The service handles:

        - Checking whether the email exists
        - Hashing the password
        - Creating the MongoDB user
        - Generating the JWT
        --------------------------------------------------------------
        */

        const result = await registerUserService({

            name,
            email,
            password

        });


        /*
        --------------------------------------------------------------
        Send Response
        --------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message: "User registered successfully",

            data: result

        });

    } catch (error) {

        /*
        --------------------------------------------------------------
        Error Handling
        --------------------------------------------------------------

        Errors thrown by the service arrive here.

        Example:

        "User already exists"
        --------------------------------------------------------------
        */

        console.error(
            "Registration error:",
            error.message
        );

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
|
| POST /api/auth/login
|
| Responsibilities:
|
| 1. Receive email and password.
| 2. Validate the request.
| 3. Call loginUserService().
| 4. Return the authentication result.
|--------------------------------------------------------------------------
*/

export const loginUser = async (req, res) => {

    try {

        /*
        --------------------------------------------------------------
        Get Login Credentials
        --------------------------------------------------------------
        */

        const {
            email,
            password
        } = req.body;


        /*
        --------------------------------------------------------------
        Basic Validation
        --------------------------------------------------------------
        */

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });
        }


        /*
        --------------------------------------------------------------
        Call Login Service
        --------------------------------------------------------------

        auth.service.js handles:

        1. Finding the user.
        2. Comparing the password with bcrypt.
        3. Generating the JWT.
        --------------------------------------------------------------
        */

        const result = await loginUserService({

            email,
            password

        });


        /*
        --------------------------------------------------------------
        Successful Login
        --------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message: "Login successful",

            data: result

        });

    } catch (error) {

        /*
        --------------------------------------------------------------
        Login Error
        --------------------------------------------------------------
        */

        console.error(
            "Login error:",
            error.message
        );

        return res.status(401).json({

            success: false,

            message: error.message

        });
    }
};