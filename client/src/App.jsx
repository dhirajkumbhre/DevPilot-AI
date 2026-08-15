/*
|--------------------------------------------------------------------------
| File        : App.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Root component of the React application.
|
| Responsibilities:
|
| 1. Check backend health.
| 2. Show loading state.
| 3. Show backend error state.
| 4. Decide between Login, Register and Dashboard.
|
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";

import { getBackendHealth } from "./services/health.service.js";

import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";


function App() {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    const { token } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Register / Login Switch
    |--------------------------------------------------------------------------
    */

    const [showRegister, setShowRegister] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Backend Health
    |--------------------------------------------------------------------------
    */

    const [health, setHealth] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Backend Health Check
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const checkBackend = async () => {

            try {

                const response = await getBackendHealth();

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

        };


        checkBackend();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div style={styles.centerPage}>

                <div style={styles.logo}>
                    ☠️
                </div>

                <h1 style={styles.title}>
                    DevPilot AI
                </h1>

                <p style={styles.muted}>
                    Connecting to your developer workspace...
                </p>

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
            <div style={styles.centerPage}>

                <div style={styles.logo}>
                    🍺
                </div>

                <h1 style={styles.title}>
                    DevPilot AI
                </h1>

                <div style={styles.errorBadge}>
                    ● Backend Offline
                </div>

                <p style={styles.muted}>
                    {error}
                </p>

                <p style={styles.small}>
                    Make sure your Express server is running.
                </p>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authenticated User
    |--------------------------------------------------------------------------
    */

    if (token) {

        return <Dashboard />;
    }


    /*
    |--------------------------------------------------------------------------
    | Authentication Pages
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.page}>

            {/* ----------------------------------------------------------
                Top Header
            ---------------------------------------------------------- */}

            <header style={styles.topBar}>

                <div style={styles.brand}>

                    <div style={styles.smallLogo}>
                        ☠️
                    </div>

                    <div>

                        <div style={styles.brandName}>
                            DevPilot AI
                        </div>

                        <div style={styles.brandSubtitle}>
                            AI Developer Workspace
                        </div>

                    </div>

                </div>


                <div style={styles.status}>

                    <span style={styles.statusDot} />

                    System Operational

                </div>

            </header>


            {/* ----------------------------------------------------------
                Main Authentication Area
            ---------------------------------------------------------- */}

            <main style={styles.main}>

                <section style={styles.hero}>

                    <div style={styles.heroLogo}>
                        ☠️
                    </div>

                    <h1 style={styles.heroTitle}>
                        DevPilot AI
                    </h1>

                    <p style={styles.heroSubtitle}>
                        Your AI-powered developer workspace
                    </p>


                    <div style={styles.features}>

                        <span style={styles.feature}>
                            ✦ AI Assistant
                        </span>

                        <span style={styles.feature}>
                            ◈ Project Workspace
                        </span>

                        <span style={styles.feature}>
                            ✓ Developer Tools
                        </span>

                    </div>

                </section>


                {/* ------------------------------------------------------
                    Login
                ------------------------------------------------------ */}

                {!showRegister && (

                    <Login
                        onSwitchToRegister={() =>
                            setShowRegister(true)
                        }
                    />

                )}


                {/* ------------------------------------------------------
                    Register
                ------------------------------------------------------ */}

                {showRegister && (

                    <Register
                        onSwitchToLogin={() =>
                            setShowRegister(false)
                        }
                    />

                )}


                <footer style={styles.footer}>

                    <span>DevPilot AI</span>

                    <span>•</span>

                    <span>Developer workspace</span>

                    <span>•</span>

                    <span>v1.0</span>

                </footer>

            </main>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {

    page: {
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        padding: "28px 24px",
        background:
            "radial-gradient(circle at 50% -10%, #1d2a4a 0%, #0b1020 38%, #060a12 75%)",
        color: "#e8edf7",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
    },


    centerPage: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#070b14",
        color: "#ffffff",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
    },


    logo: {
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        background:
            "linear-gradient(135deg, #4f7fff, #7659e8)",
        fontSize: "28px",
        marginBottom: "16px",
    },


    title: {
        margin: 0,
        fontSize: "26px",
    },


    muted: {
        color: "#7d899d",
        fontSize: "13px",
    },


    small: {
        color: "#536076",
        fontSize: "11px",
    },


    errorBadge: {
        marginTop: "15px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #65313b",
        background: "rgba(104, 37, 48, 0.25)",
        color: "#ff9aa7",
        fontSize: "12px",
        fontWeight: "700",
    },


    topBar: {
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "14px 18px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #1d293b",
        borderRadius: "11px",
        background: "rgba(12, 19, 32, 0.72)",
        backdropFilter: "blur(12px)",
    },


    brand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },


    smallLogo: {
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9px",
        background:
            "linear-gradient(135deg, #4f7df3, #7058e8)",
        fontSize: "18px",
    },


    brandName: {
        fontSize: "13px",
        fontWeight: "800",
    },


    brandSubtitle: {
        marginTop: "2px",
        color: "#65738a",
        fontSize: "9px",
    },


    status: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "7px 10px",
        border: "1px solid #1d4938",
        borderRadius: "7px",
        background: "rgba(21, 74, 51, 0.15)",
        color: "#65c89a",
        fontSize: "9px",
        fontWeight: "700",
    },


    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#45d18c",
    },


    main: {
        width: "100%",
        maxWidth: "440px",
        margin: "55px auto 0",
    },


    hero: {
        textAlign: "center",
        marginBottom: "28px",
    },


    heroLogo: {
        width: "60px",
        height: "60px",
        margin: "0 auto 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        background:
            "linear-gradient(135deg, #4f7fff, #7659e8)",
        boxShadow:
            "0 12px 35px rgba(78, 112, 235, 0.28)",
        fontSize: "28px",
    },


    heroTitle: {
        margin: 0,
        fontSize: "29px",
        fontWeight: "800",
    },


    heroSubtitle: {
        margin: "7px 0 15px",
        color: "#8793a8",
        fontSize: "13px",
    },


    features: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "7px",
    },


    feature: {
        padding: "5px 8px",
        border: "1px solid #202c40",
        borderRadius: "6px",
        background: "rgba(17, 26, 42, 0.65)",
        color: "#78869b",
        fontSize: "9px",
    },


    footer: {
        display: "flex",
        justifyContent: "center",
        gap: "7px",
        marginTop: "18px",
        color: "#536076",
        fontSize: "9px",
    },
};


export default App;