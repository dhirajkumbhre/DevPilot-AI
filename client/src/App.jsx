/*
|--------------------------------------------------------------------------
| File        : App.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose
| -------
| Root component of our application.
|
| Responsibilities
| ----------------
| • Check whether backend is running
| • Display backend information
| • Show loading state
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

// Import service responsible for backend communication
import { getBackendHealth } from "./services/health.service";

function App() {

    /*
    |--------------------------------------------------------------------------
    | Component State
    |--------------------------------------------------------------------------
    */

    // Stores backend response
    const [health, setHealth] = useState(null);

    // Shows loading while request is in progress
    const [loading, setLoading] = useState(true);

    // Stores any connection error
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch Backend Health
    |--------------------------------------------------------------------------
    |
    | Runs only once after page loads.
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        async function fetchBackendHealth() {

            try {

                const response = await getBackendHealth();

                setHealth(response);

            } catch (err) {

                console.error(err);

                setError("Unable to connect to backend.");

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

            <div style={styles.container}>

                <h2>Connecting to DevPilot AI...</h2>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Error Screen
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div style={styles.container}>

                <h2>🔴 Backend Offline</h2>

                <p>{error}</p>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Success Screen
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.container}>

            <h1>🚀 DevPilot AI</h1>

            <h3>AI Powered Developer Assistant</h3>

            <hr />

            <h2 style={{ color: "green" }}>

                🟢 Backend Connected

            </h2>

            <p>

                <strong>Project :</strong> {health.project}

            </p>

            <p>

                <strong>Version :</strong> {health.version}

            </p>

            <p>

                <strong>Status :</strong> {health.message}

            </p>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Simple Styles
|--------------------------------------------------------------------------
|
| Later we'll replace these with Tailwind CSS.
|
|--------------------------------------------------------------------------
*/

const styles = {

    container: {

        maxWidth: "700px",

        margin: "60px auto",

        padding: "30px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        textAlign: "center",

        fontFamily: "Arial"

    }

};

export default App;