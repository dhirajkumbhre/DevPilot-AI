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
    */

    const { token } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Backend Health
    |--------------------------------------------------------------------------
    */

    const [health, setHealth] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Backend Health Check
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        async function fetchBackendHealth() {

            try {

                const response =
                    await getBackendHealth();

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

                setLoading(false);

            }

        }


        fetchBackendHealth();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div
                    style={
                        styles.loadingLogo
                    }
                >
                    🚀
                </div>

                <h2
                    style={
                        styles.loadingTitle
                    }
                >
                    DevPilot AI
                </h2>

                <p
                    style={
                        styles.loadingText
                    }
                >
                    Connecting to your
                    developer workspace...
                </p>

                <div
                    style={
                        styles.loadingIndicator
                    }
                >
                    <span
                        style={
                            styles.loadingDot
                        }
                    />

                    Connecting to backend
                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Backend Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div style={styles.errorPage}>

                <div
                    style={
                        styles.errorCard
                    }
                >

                    <div
                        style={
                            styles.errorLogo
                        }
                    >
                        🚀
                    </div>


                    <h1
                        style={
                            styles.errorTitle
                        }
                    >
                        DevPilot AI
                    </h1>


                    <div
                        style={
                            styles.offlineBadge
                        }
                    >
                        <span>
                            ●
                        </span>

                        Backend Offline
                    </div>


                    <p
                        style={
                            styles.errorMessage
                        }
                    >
                        {error}
                    </p>


                    <p
                        style={
                            styles.errorHint
                        }
                    >
                        Make sure your Express
                        server is running.
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Authenticated Application
    |--------------------------------------------------------------------------
    |
    | If token exists:
    |
    |     Dashboard
    |
    | Otherwise:
    |
    |     Login
    |
    |--------------------------------------------------------------------------
    */

    if (token) {

        return (

            <Dashboard />

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    |
    | Pass backend health information to Login.
    |
    |--------------------------------------------------------------------------
    */

    return (

        <Login
            health={health}
        />

    );

}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    loadingPage: {

        minHeight: "100vh",

        width: "100%",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        boxSizing: "border-box",

        padding: "30px",

        background:
            "linear-gradient(135deg, #070b14 0%, #0b1120 50%, #111a30 100%)",

        color: "#ffffff",

        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",

    },


    loadingLogo: {

        width: "62px",

        height: "62px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        borderRadius: "17px",

        marginBottom: "18px",

        background:
            "linear-gradient(135deg, #4f7df3, #7058e8)",

        fontSize: "29px",

        boxShadow:
            "0 12px 35px rgba(79, 125, 243, 0.28)",

    },


    loadingTitle: {

        margin: "0 0 7px",

        fontSize: "24px",

        fontWeight: "800",

    },


    loadingText: {

        margin: "0 0 20px",

        color: "#7d899d",

        fontSize: "12px",

    },


    loadingIndicator: {

        display: "flex",

        alignItems: "center",

        gap: "8px",

        padding:
            "8px 12px",

        border:
            "1px solid #202c40",

        borderRadius: "8px",

        color: "#8290a5",

        background:
            "rgba(17, 25, 40, 0.8)",

        fontSize: "10px",

    },


    loadingDot: {

        width: "7px",

        height: "7px",

        borderRadius: "50%",

        background: "#e5a83b",

        boxShadow:
            "0 0 10px rgba(229, 168, 59, 0.5)",

    },


    /*
    |--------------------------------------------------------------------------
    | Error Page
    |--------------------------------------------------------------------------
    */

    errorPage: {

        minHeight: "100vh",

        width: "100%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "30px",

        boxSizing: "border-box",

        background:
            "linear-gradient(135deg, #070b14 0%, #0b1120 50%, #111a30 100%)",

        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",

    },


    errorCard: {

        width: "100%",

        maxWidth: "390px",

        padding: "35px",

        boxSizing: "border-box",

        textAlign: "center",

        border:
            "1px solid #28354a",

        borderRadius: "15px",

        background:
            "#0f1727",

        boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.35)",

    },


    errorLogo: {

        fontSize: "34px",

        marginBottom: "10px",

    },


    errorTitle: {

        margin: "0 0 18px",

        color: "#f0f4fa",

        fontSize: "24px",

    },


    offlineBadge: {

        display: "inline-flex",

        alignItems: "center",

        gap: "7px",

        padding:
            "7px 11px",

        border:
            "1px solid #65313b",

        borderRadius: "7px",

        background:
            "rgba(104, 37, 48, 0.25)",

        color: "#ff9aa7",

        fontSize: "11px",

        fontWeight: "700",

    },


    errorMessage: {

        margin:
            "20px 0 7px",

        color: "#c5ccda",

        fontSize: "12px",

    },


    errorHint: {

        margin: "0",

        color: "#69768b",

        fontSize: "10px",

    },

};


export default App;