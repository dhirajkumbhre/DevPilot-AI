/*
|--------------------------------------------------------------------------
| File        : Register.jsx
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Registration page.
|
|--------------------------------------------------------------------------
*/

import { useState } from "react";

import { registerUser } from "../services/auth.service.js";

import { useAuth } from "../context/AuthContext.jsx";


const Register = ({ onSwitchToLogin }) => {

    const { login } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Form State
    |--------------------------------------------------------------------------
    */

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (!name || !email || !password) {

            setError(
                "Name, email and password are required."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            /*
            ----------------------------------------------------------
            Register user
            ----------------------------------------------------------
            */

            const data = await registerUser({

                name,
                email,
                password,

            });


            /*
            ----------------------------------------------------------
            Automatically log the user in.
            ----------------------------------------------------------
            */

            await login({

                email,
                password,

            });


            console.log(
                "Registration successful:",
                data
            );

        } catch (err) {

            console.error(
                "Registration failed:",
                err
            );

            setError(
                err.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <section style={styles.card}>

            <div style={styles.header}>

                <h2 style={styles.title}>
                    Create your account
                </h2>

                <p style={styles.subtitle}>
                    Start building with DevPilot AI.
                </p>

            </div>


            {error && (

                <div style={styles.error}>

                    <span style={styles.errorIcon}>
                        !
                    </span>

                    {error}

                </div>

            )}


            <form onSubmit={handleSubmit}>


                {/* Name */}

                <div style={styles.field}>

                    <label style={styles.label}>
                        Full name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        placeholder="Your name"
                        autoComplete="name"
                        disabled={loading}
                        style={styles.input}
                    />

                </div>


                {/* Email */}

                <div style={styles.field}>

                    <label style={styles.label}>
                        Email address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        style={styles.input}
                    />

                </div>


                {/* Password */}

                <div style={styles.field}>

                    <label style={styles.label}>
                        Password
                    </label>

                    <div style={styles.passwordWrapper}>

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Minimum 6 characters"
                            autoComplete="new-password"
                            disabled={loading}
                            style={styles.input}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (value) => !value
                                )
                            }
                            style={styles.showButton}
                        >
                            {showPassword
                                ? "Hide"
                                : "Show"}
                        </button>

                    </div>

                </div>


                {/* Confirm Password */}

                <div style={styles.field}>

                    <label style={styles.label}>
                        Confirm password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={loading}
                        style={styles.input}
                    />

                </div>


                {/* Register */}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.registerButton,
                        ...(loading
                            ? styles.disabled
                            : {}),
                    }}
                >

                    {loading
                        ? "Creating account..."
                        : "Create account  →"}

                </button>


                {/* Login */}

                <div style={styles.switch}>

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        style={styles.loginLink}
                    >
                        Sign in
                    </button>

                </div>


                <div style={styles.security}>
                    🔒 Your password is securely hashed
                    before storage.
                </div>

            </form>

        </section>
    );
};


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = {

    card: {
        width: "100%",
        padding: "30px",
        boxSizing: "border-box",
        border: "1px solid #202b3e",
        borderRadius: "14px",
        background: "rgba(15, 22, 36, 0.94)",
        boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.38)",
    },


    header: {
        marginBottom: "24px",
    },


    title: {
        margin: "0 0 7px",
        color: "#f0f4fa",
        fontSize: "21px",
    },


    subtitle: {
        margin: 0,
        color: "#7d899d",
        fontSize: "12px",
    },


    error: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "10px 11px",
        marginBottom: "18px",
        border: "1px solid #5a2934",
        borderRadius: "8px",
        background: "rgba(96, 27, 42, 0.28)",
        color: "#ff9ca8",
        fontSize: "11px",
    },


    errorIcon: {
        width: "18px",
        height: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "#8e3346",
        color: "#ffffff",
        fontWeight: "800",
    },


    field: {
        marginBottom: "16px",
    },


    label: {
        display: "block",
        marginBottom: "7px",
        color: "#c4cddb",
        fontSize: "11px",
        fontWeight: "650",
    },


    input: {
        width: "100%",
        height: "44px",
        padding: "0 13px",
        boxSizing: "border-box",
        border: "1px solid #28364b",
        borderRadius: "8px",
        outline: "none",
        background: "#0b111d",
        color: "#edf2f8",
        fontSize: "12px",
    },


    passwordWrapper: {
        position: "relative",
    },


    showButton: {
        position: "absolute",
        right: "10px",
        top: "13px",
        border: "none",
        background: "transparent",
        color: "#718098",
        cursor: "pointer",
        fontSize: "9px",
    },


    registerButton: {
        width: "100%",
        height: "45px",
        marginTop: "5px",
        border: "1px solid #5b83e8",
        borderRadius: "8px",
        background:
            "linear-gradient(135deg, #4c78e8, #5b6fe1)",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "750",
    },


    disabled: {
        opacity: 0.65,
        cursor: "not-allowed",
    },


    switch: {
        display: "flex",
        justifyContent: "center",
        gap: "7px",
        marginTop: "20px",
        paddingTop: "18px",
        borderTop: "1px solid #1c2637",
        color: "#657288",
        fontSize: "10px",
    },


    loginLink: {
        border: "none",
        background: "transparent",
        color: "#6f91ef",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "10px",
    },


    security: {
        marginTop: "16px",
        textAlign: "center",
        color: "#657288",
        fontSize: "9px",
    },
};


export default Register;