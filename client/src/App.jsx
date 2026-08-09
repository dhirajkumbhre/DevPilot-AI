/*
|--------------------------------------------------------------------------
| File        : App.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Root component of the React application.
|
| Responsibilities:
|
| 1. Check backend health.
| 2. Show loading state.
| 3. Show backend error state.
| 4. Determine whether the user is authenticated.
| 5. Show Login or Dashboard accordingly.
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| Backend Health Service
|--------------------------------------------------------------------------
*/

import { getBackendHealth } from "./services/health.service";

/*
|--------------------------------------------------------------------------
| Authentication Context
|--------------------------------------------------------------------------
*/

import { useAuth } from "./context/AuthContext.jsx";

/*
|--------------------------------------------------------------------------
| Application Pages
|--------------------------------------------------------------------------
*/

import Login from "./pages/Login.jsx";

import Dashboard from "./pages/Dashboard.jsx";


/*
|--------------------------------------------------------------------------
| App Component
|--------------------------------------------------------------------------
*/

function App() {

    /*
    |--------------------------------------------------------------------------
    | Authentication State
    |--------------------------------------------------------------------------
    |
    | AuthContext tells us whether a JWT currently exists.
    |
    |--------------------------------------------------------------------------
    */

    const { token } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Backend Health State
    |--------------------------------------------------------------------------
    */

    const [health, setHealth] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Backend Health Check
    |--------------------------------------------------------------------------
    |
    | Runs once when App.jsx first loads.
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        async function fetchBackendHealth() {

            try {

                /*
                Send request to our backend health endpoint.
                */

                const response = await getBackendHealth();

                /*
                Store backend response.
                */

                setHealth(response);

            } catch (err) {

                console.error(
                    "Backend health check failed:",
                    err
                );

                setError(
                    "Unable to connect to backend."
                );

            } finally {

                /*
                Whether successful or failed,
                the loading state is finished.
                */

                setLoading(false);
            }
        }


        /*
        Execute the health check.
        */

        fetchBackendHealth();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div style={styles.container}>

                <h2>
                    Connecting to DevPilot AI...
                </h2>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Backend Error Screen
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div style={styles.container}>

                <h2>
                    🔴 Backend Offline
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authentication-Based Application
    |--------------------------------------------------------------------------
    |
    | If a JWT exists:
    |
    |     → Dashboard
    |
    | Otherwise:
    |
    |     → Login
    |
    |--------------------------------------------------------------------------
    */

    return (

        <div>

            {/* ----------------------------------------------------------
                Backend Health Information
            ---------------------------------------------------------- */}

            <div style={styles.healthContainer}>

                <h1>
                    🚀 DevPilot AI
                </h1>

                <h3>
                    AI Powered Developer Assistant
                </h3>

                <hr />

                <h2 style={styles.connected}>

                    🟢 Backend Connected

                </h2>

                <p>

                    <strong>
                        Project:
                    </strong>{" "}

                    {health?.project}

                </p>

                <p>

                    <strong>
                        Version:
                    </strong>{" "}

                    {health?.version}

                </p>

                <p>

                    <strong>
                        Status:
                    </strong>{" "}

                    {health?.message}

                </p>

            </div>


            {/* ----------------------------------------------------------
                Login OR Dashboard
            ---------------------------------------------------------- */}

            {token ? (

                /*
                User has a JWT.
                Show protected dashboard.
                */

                <Dashboard />

            ) : (

                /*
                User does not have a JWT.
                Show login page.
                */

                <Login />

            )}

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Temporary Styles
|--------------------------------------------------------------------------
*/

const styles = {

    healthContainer: {

        maxWidth: "700px",

        margin: "30px auto",

        padding: "25px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        textAlign: "center",

        fontFamily: "Arial, sans-serif",

        backgroundColor: "#ffffff",
    },


    container: {

        maxWidth: "700px",

        margin: "60px auto",

        padding: "30px",

        textAlign: "center",

        fontFamily: "Arial, sans-serif",
    },


    connected: {

        color: "green",
    },
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default App;