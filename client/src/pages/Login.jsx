/*
|--------------------------------------------------------------------------
| File        : Login.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Provides the login form for DevPilot AI.
|
|--------------------------------------------------------------------------
|
| Login Flow:
|
| User enters email + password
|          ↓
| handleSubmit()
|          ↓
| AuthContext.login()
|          ↓
| auth.service.js
|          ↓
| POST /api/auth/login
|          ↓
| Backend verifies credentials
|          ↓
| JWT returned
|          ↓
| AuthContext stores user + JWT
|
|--------------------------------------------------------------------------
*/

import { useState } from "react";

/*
|--------------------------------------------------------------------------
| Authentication Context
|--------------------------------------------------------------------------
|
| useAuth gives this component access to the central authentication
| system.
|
|--------------------------------------------------------------------------
*/

import { useAuth } from "../context/AuthContext.jsx";


/*
|--------------------------------------------------------------------------
| Login Component
|--------------------------------------------------------------------------
*/

const Login = () => {

    /*
    |--------------------------------------------------------------------------
    | Get Login Function
    |--------------------------------------------------------------------------
    |
    | AuthContext contains the login() function.
    |
    | We don't directly call fetch() from this component.
    |
    |--------------------------------------------------------------------------
    */

    const { login } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Form State
    |--------------------------------------------------------------------------
    |
    | React state keeps track of what the user has typed.
    |
    |--------------------------------------------------------------------------
    */

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    /*
    |--------------------------------------------------------------------------
    | UI State
    |--------------------------------------------------------------------------
    |
    | loading → request is currently being processed
    | error   → stores an error message
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Handle Login
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        /*
        Prevent the browser from refreshing the page.
        */

        event.preventDefault();


        /*
        Clear any previous error.
        */

        setError("");


        /*
        |--------------------------------------------------------------------------
        | Basic Frontend Validation
        |--------------------------------------------------------------------------
        */

        if (!email || !password) {

            setError(
                "Email and password are required."
            );

            return;
        }


        try {

            /*
            --------------------------------------------------------------
            | Start Loading
            --------------------------------------------------------------
            */

            setLoading(true);


            /*
            --------------------------------------------------------------
            | Call AuthContext Login
            --------------------------------------------------------------
            |
            | AuthContext will:
            |
            | 1. Call the authentication service.
            | 2. Receive the JWT.
            | 3. Store the user.
            | 4. Store the JWT.
            | 5. Store the JWT in localStorage.
            |
            --------------------------------------------------------------
            */

            const response = await login({

                email,

                password,
            });


            /*
            --------------------------------------------------------------
            | Successful Login
            --------------------------------------------------------------
            |
            | For now we log the response.
            |
            | App.jsx will later detect the authentication state
            | and show the Dashboard.
            |
            --------------------------------------------------------------
            */

            console.log(
                "Login successful:",
                response
            );


        } catch (error) {

            /*
            --------------------------------------------------------------
            | Login Failed
            --------------------------------------------------------------
            */

            console.error(
                "Login failed:",
                error
            );


            /*
            Show the backend error to the user.
            */

            setError(
                error.message || "Login failed."
            );


        } finally {

            /*
            --------------------------------------------------------------
            | Stop Loading
            --------------------------------------------------------------
            */

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Login User Interface
    |--------------------------------------------------------------------------
    */

    return (

        <div>

            <h2>
                Login
            </h2>


            <form onSubmit={handleSubmit}>

                {/* ------------------------------------------------------
                    Email Field
                ------------------------------------------------------ */}

                <div>

                    <label htmlFor="email">
                        Email
                    </label>

                    <br />

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                    />

                </div>


                <br />


                {/* ------------------------------------------------------
                    Password Field
                ------------------------------------------------------ */}

                <div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <br />

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                    />

                </div>


                <br />


                {/* ------------------------------------------------------
                    Error Message
                ------------------------------------------------------ */}

                {error && (

                    <p style={styles.error}>

                        {error}

                    </p>

                )}


                {/* ------------------------------------------------------
                    Login Button
                ------------------------------------------------------ */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>

            </form>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Temporary Styles
|--------------------------------------------------------------------------
|
| Later we'll build a proper UI instead of using inline styles.
|
|--------------------------------------------------------------------------
*/

const styles = {

    error: {

        color: "red",
    },
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default Login;