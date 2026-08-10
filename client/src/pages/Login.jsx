/*
|--------------------------------------------------------------------------
| File        : Login.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Professional login interface for DevPilot AI.
|
| Authentication logic remains connected to AuthContext.
|
|--------------------------------------------------------------------------
*/

import { useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";


/*
|--------------------------------------------------------------------------
| Login Component
|--------------------------------------------------------------------------
*/

const Login = () => {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    const { login } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Form State
    |--------------------------------------------------------------------------
    */

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    /*
    |--------------------------------------------------------------------------
    | UI State
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Handle Login
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        /*
        Basic validation.
        */

        if (!email || !password) {

            setError(
                "Please enter your email and password."
            );

            return;
        }


        try {

            setLoading(true);


            /*
            Call the existing authentication system.
            */

            const response = await login({

                email,

                password,

            });


            /*
            App.jsx detects the new JWT and
            automatically displays Dashboard.
            */

            console.log(
                "Login successful:",
                response
            );


        } catch (error) {

            console.error(
                "Login failed:",
                error
            );


            setError(
                error.message ||
                "Unable to sign in. Please check your credentials."
            );


        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div style={styles.page}>
            

            <header style={styles.topBar}>

    <div style={styles.headerBrand}>

        <div style={styles.headerLogo}>
            🚀
        </div>

        <div>

            <div style={styles.headerName}>
                DevPilot AI
            </div>

            <div style={styles.headerSubtitle}>
                AI Developer Workspace
            </div>

        </div>

    </div>


    <div style={styles.systemStatus}>

        <span style={styles.statusDot} />

        System Operational

    </div>

</header>
            {/* ==========================================================
                Background Decoration
            ========================================================== */}

            <div
                style={
                    styles.backgroundGlowOne
                }
            />

            <div
                style={
                    styles.backgroundGlowTwo
                }
            />


            {/* ==========================================================
                Main Container
            ========================================================== */}

            <main
                style={
                    styles.main
                }
            >

                {/* ======================================================
                    BRAND / HERO
                ====================================================== */}

                <section
                    style={
                        styles.hero
                    }
                >

                    <div
                        style={
                            styles.logo
                        }
                    >
                        🚀
                    </div>


                    <h1
                        style={
                            styles.brandName
                        }
                    >
                        DevPilot AI
                    </h1>


                    <p
                        style={
                            styles.tagline
                        }
                    >
                        Your AI-powered
                        developer workspace
                    </p>


                    <div
                        style={
                            styles.featureRow
                        }
                    >

                        <span
                            style={
                                styles.feature
                            }
                        >
                            ✦ AI Assistant
                        </span>

                        <span
                            style={
                                styles.feature
                            }
                        >
                            ◈ Project Workspace
                        </span>

                        <span
                            style={
                                styles.feature
                            }
                        >
                            ✓ Developer Tools
                        </span>

                    </div>

                </section>


                {/* ======================================================
                    LOGIN CARD
                ====================================================== */}

                <section
                    style={
                        styles.card
                    }
                >

                    <div
                        style={
                            styles.cardHeader
                        }
                    >

                        <h2
                            style={
                                styles.title
                            }
                        >
                            Welcome back
                        </h2>


                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Sign in to continue
                            building.
                        </p>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            style={
                                styles.error
                            }
                        >

                            <span
                                style={
                                    styles.errorIcon
                                }
                            >
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* ------------------------------------------------
                            Email
                        ------------------------------------------------ */}

                        <div
                            style={
                                styles.field
                            }
                        >

                            <label
                                htmlFor="email"
                                style={
                                    styles.label
                                }
                            >
                                Email address
                            </label>


                            <div
                                style={
                                    styles.inputWrapper
                                }
                            >

                                <span
                                    style={
                                        styles.inputIcon
                                    }
                                >
                                    @
                                </span>


                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    style={
                                        styles.input
                                    }
                                    disabled={
                                        loading
                                    }
                                />

                            </div>

                        </div>


                        {/* ------------------------------------------------
                            Password
                        ------------------------------------------------ */}

                        <div
                            style={
                                styles.field
                            }
                        >

                            <div
                                style={
                                    styles.labelRow
                                }
                            >

                                <label
                                    htmlFor="password"
                                    style={
                                        styles.label
                                    }
                                >
                                    Password
                                </label>

                            </div>


                            <div
                                style={
                                    styles.inputWrapper
                                }
                            >

                                <span
                                    style={
                                        styles.inputIcon
                                    }
                                >
                                    •
                                </span>


                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    style={
                                        styles.input
                                    }
                                    disabled={
                                        loading
                                    }
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    style={
                                        styles.passwordButton
                                    }
                                    tabIndex={-1}
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* ==================================================
                            SUBMIT
                        ================================================== */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            style={{
                                ...styles.loginButton,

                                ...(loading
                                    ? styles.loginButtonDisabled
                                    : {}),
                            }}
                        >

                            {loading ? (

                                <>

                                    <span
                                        style={
                                            styles.spinner
                                        }
                                    >
                                        ◌
                                    </span>

                                    Signing in...

                                </>

                            ) : (

                                <>
                                    Sign in
                                    <span
                                        style={
                                            styles.arrow
                                        }
                                    >
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>


                    {/* ==================================================
                        SECURITY NOTE
                    ================================================== */}

                    <div
                        style={
                            styles.security
                        }
                    >

                        <span>
                            🔒
                        </span>

                        <span>
                            Your session is secured
                            with JWT authentication.
                        </span>

                    </div>

                </section>


                {/* ======================================================
                    FOOTER
                ====================================================== */}

                <footer
                    style={
                        styles.footer
                    }
                >

                    <span>
                        DevPilot AI
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        Developer workspace
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        v1.0
                    </span>

                </footer>

            </main>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {
    topBar: {

    width: "100%",

    maxWidth: "1080px",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "14px 18px",

    marginBottom: "55px",

    boxSizing: "border-box",

    border:
        "1px solid #1d293b",

    borderRadius: "11px",

    background:
        "rgba(12, 19, 32, 0.72)",

    backdropFilter:
        "blur(12px)",

},


headerBrand: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

},


headerLogo: {

    width: "34px",

    height: "34px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "9px",

    background:
        "linear-gradient(135deg, #4f7df3, #7058e8)",

    fontSize: "17px",

},


headerName: {

    color: "#edf2fa",

    fontSize: "13px",

    fontWeight: "800",

},


headerSubtitle: {

    marginTop: "2px",

    color: "#65738a",

    fontSize: "8px",

},


systemStatus: {

    display: "flex",

    alignItems: "center",

    gap: "7px",

    padding:
        "6px 9px",

    border:
        "1px solid #1d4938",

    borderRadius: "7px",

    background:
        "rgba(21, 74, 51, 0.15)",

    color: "#65c89a",

    fontSize: "9px",

    fontWeight: "650",

},


statusDot: {

    width: "6px",

    height: "6px",

    borderRadius: "50%",

    background: "#45d18c",

    boxShadow:
        "0 0 9px rgba(69, 209, 140, 0.65)",

},

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    page: {

        minHeight: "100vh",

        width: "100%",

        position: "relative",

        overflow: "hidden",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "40px 20px",

        boxSizing: "border-box",

        background:
            "radial-gradient(circle at 50% -10%, #1d2a4a 0%, #0b1020 38%, #060a12 75%)",

        color: "#e8edf7",

        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",

    },


    /*
    |--------------------------------------------------------------------------
    | Background Glow
    |--------------------------------------------------------------------------
    */

    backgroundGlowOne: {

        position: "absolute",

        width: "420px",

        height: "420px",

        borderRadius: "50%",

        background:
            "rgba(70, 105, 190, 0.10)",

        filter:
            "blur(90px)",

        top: "-180px",

        left: "-120px",

        pointerEvents: "none",

    },


    backgroundGlowTwo: {

        position: "absolute",

        width: "380px",

        height: "380px",

        borderRadius: "50%",

        background:
            "rgba(110, 75, 190, 0.08)",

        filter:
            "blur(90px)",

        bottom: "-180px",

        right: "-100px",

        pointerEvents: "none",

    },


    /*
    |--------------------------------------------------------------------------
    | Main
    |--------------------------------------------------------------------------
    */

    main: {

        width: "100%",

        maxWidth: "440px",

        position: "relative",

        zIndex: 1,

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

    },


    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

    hero: {

        textAlign: "center",

        marginBottom: "28px",

    },


    logo: {

        width: "58px",

        height: "58px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        margin: "0 auto 14px",

        borderRadius: "16px",

        background:
            "linear-gradient(135deg, #4f7fff, #7659e8)",

        boxShadow:
            "0 12px 35px rgba(78, 112, 235, 0.28)",

        fontSize: "27px",

    },


    brandName: {

        margin: "0",

        fontSize: "28px",

        fontWeight: "800",

        letterSpacing: "-0.7px",

    },


    tagline: {

        margin:
            "7px 0 15px",

        color: "#8793a8",

        fontSize: "13px",

    },


    featureRow: {

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        flexWrap: "wrap",

        gap: "7px",

    },


    feature: {

        padding:
            "5px 8px",

        border:
            "1px solid #202c40",

        borderRadius: "6px",

        background:
            "rgba(17, 26, 42, 0.65)",

        color: "#78869b",

        fontSize: "9px",

    },


    /*
    |--------------------------------------------------------------------------
    | Card
    |--------------------------------------------------------------------------
    */

    card: {

        width: "100%",

        padding: "30px",

        boxSizing: "border-box",

        border:
            "1px solid #202b3e",

        borderRadius: "14px",

        background:
            "rgba(15, 22, 36, 0.92)",

        boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.38)",

        backdropFilter:
            "blur(14px)",

    },


    cardHeader: {

        marginBottom: "24px",

    },


    title: {

        margin: "0 0 7px",

        fontSize: "20px",

        fontWeight: "750",

        color: "#f0f4fa",

    },


    subtitle: {

        margin: "0",

        color: "#7d899d",

        fontSize: "12px",

    },


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    error: {

        display: "flex",

        alignItems: "center",

        gap: "9px",

        padding: "10px 11px",

        marginBottom: "18px",

        border:
            "1px solid #5a2934",

        borderRadius: "8px",

        background:
            "rgba(96, 27, 42, 0.28)",

        color: "#ff9ca8",

        fontSize: "11px",

        lineHeight: "1.4",

    },


    errorIcon: {

        width: "18px",

        height: "18px",

        flex: "0 0 auto",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        borderRadius: "50%",

        background: "#8e3346",

        color: "#fff",

        fontSize: "10px",

        fontWeight: "800",

    },


    /*
    |--------------------------------------------------------------------------
    | Field
    |--------------------------------------------------------------------------
    */

    field: {

        marginBottom: "17px",

    },


    labelRow: {

        display: "flex",

        justifyContent: "space-between",

        marginBottom: "7px",

    },


    label: {

        display: "block",

        marginBottom: "7px",

        color: "#c4cddb",

        fontSize: "11px",

        fontWeight: "650",

    },


    /*
    |--------------------------------------------------------------------------
    | Input
    |--------------------------------------------------------------------------
    */

    inputWrapper: {

        position: "relative",

        display: "flex",

        alignItems: "center",

        width: "100%",

    },


    inputIcon: {

        position: "absolute",

        left: "13px",

        zIndex: 1,

        color: "#617087",

        fontSize: "12px",

        fontWeight: "700",

        pointerEvents: "none",

    },


    input: {

        width: "100%",

        height: "44px",

        padding:
            "0 13px 0 35px",

        boxSizing: "border-box",

        border:
            "1px solid #28364b",

        borderRadius: "8px",

        outline: "none",

        background:
            "#0b111d",

        color: "#edf2f8",

        fontSize: "12px",

        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",

        transition:
            "border-color 0.18s ease, box-shadow 0.18s ease",

    },


    passwordButton: {

        position: "absolute",

        right: "9px",

        border: "none",

        background: "transparent",

        color: "#718098",

        cursor: "pointer",

        fontSize: "9px",

        fontWeight: "650",

    },


    /*
    |--------------------------------------------------------------------------
    | Login Button
    |--------------------------------------------------------------------------
    */

    loginButton: {

        width: "100%",

        height: "45px",

        marginTop: "5px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "8px",

        border:
            "1px solid #5b83e8",

        borderRadius: "8px",

        background:
            "linear-gradient(135deg, #4c78e8, #5b6fe1)",

        color: "#ffffff",

        cursor: "pointer",

        fontSize: "12px",

        fontWeight: "750",

        boxShadow:
            "0 8px 24px rgba(76, 120, 232, 0.18)",

        transition:
            "transform 0.18s ease, opacity 0.18s ease",

    },


    loginButtonDisabled: {

        opacity: 0.65,

        cursor: "not-allowed",

    },


    arrow: {

        fontSize: "15px",

    },


    spinner: {

        fontSize: "17px",

    },


    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    */

    security: {

        marginTop: "19px",

        paddingTop: "16px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "7px",

        borderTop:
            "1px solid #1c2637",

        color: "#657288",

        fontSize: "9px",

        textAlign: "center",

    },


    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    footer: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        marginTop: "18px",

        color: "#536076",

        fontSize: "9px",

    },

};


export default Login;