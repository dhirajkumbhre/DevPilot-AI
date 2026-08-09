/*
|--------------------------------------------------------------------------
| File        : Dashboard.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| This is the first protected page of DevPilot AI.
|
| The dashboard is shown after the user successfully logs in.
|
| For now it displays:
|
| - Welcome message
| - Logged-in user's information
| - Authentication status
| - Logout button
|
| Later this page will contain our Project workspace and
| AI developer tools.
|
|--------------------------------------------------------------------------
*/

import { useAuth } from "../context/AuthContext.jsx";


/*
|--------------------------------------------------------------------------
| Dashboard Component
|--------------------------------------------------------------------------
*/

const Dashboard = () => {

    /*
    |--------------------------------------------------------------------------
    | Authentication Data
    |--------------------------------------------------------------------------
    |
    | AuthContext gives us information about the current user
    | and the logout function.
    |
    |--------------------------------------------------------------------------
    */

    const {
        user,
        logout,
        token,
    } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Dashboard UI
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.container}>

            {/* ----------------------------------------------------------
                Header
            ---------------------------------------------------------- */}

            <header style={styles.header}>

                <div>

                    <h1>
                        🚀 DevPilot AI
                    </h1>

                    <p>
                        AI Powered Developer Assistant
                    </p>

                </div>


                {/* Logout Button */}

                <button
                    onClick={logout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>

            </header>


            <hr />


            {/* ----------------------------------------------------------
                Welcome Section
            ---------------------------------------------------------- */}

            <main>

                <h2>
                    Welcome{user?.name ? `, ${user.name}` : ""}! 👋
                </h2>

                <p>
                    Your developer workspace is ready.
                </p>


                {/* ------------------------------------------------------
                    Authentication Status
                ------------------------------------------------------ */}

                <section style={styles.card}>

                    <h3>
                        🔐 Authentication
                    </h3>

                    <p>
                        🟢 You are authenticated.
                    </p>

                    <p>
                        JWT token received successfully.
                    </p>

                    {/* 
                    We deliberately do NOT display the actual JWT
                    on the screen.
                    */}

                    <p>
                        Token status:{" "}
                        {token ? "Available" : "Missing"}
                    </p>

                </section>


                {/* ------------------------------------------------------
                    User Information
                ------------------------------------------------------ */}

                <section style={styles.card}>

                    <h3>
                        👤 Account
                    </h3>

                    <p>
                        <strong>Name:</strong>{" "}
                        {user?.name || "Unknown"}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {user?.email || "Unknown"}
                    </p>

                </section>


                {/* ------------------------------------------------------
                    Projects Placeholder
                ------------------------------------------------------ */}

                <section style={styles.card}>

                    <h3>
                        📁 My Projects
                    </h3>

                    <p>
                        Your projects will appear here soon.
                    </p>

                    <button>
                        + Create Project
                    </button>

                </section>

            </main>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Temporary Styles
|--------------------------------------------------------------------------
|
| These styles are intentionally simple.
|
| Later we'll build the actual DevPilot AI UI.
|
|--------------------------------------------------------------------------
*/

const styles = {

    container: {

        maxWidth: "900px",

        margin: "40px auto",

        padding: "30px",

        fontFamily: "Arial, sans-serif",
    },


    header: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",
    },


    logoutButton: {

        padding: "10px 18px",

        cursor: "pointer",
    },


    card: {

        marginTop: "20px",

        padding: "20px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        backgroundColor: "#ffffff",
    },
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default Dashboard;