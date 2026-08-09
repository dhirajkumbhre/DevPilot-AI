/*
--------------------------------------------------------------
| React Application Entry Point
--------------------------------------------------------------
|
| This is the file where our React application starts.
|
| We:
|
| 1. Create the React root.
| 2. Wrap the application with AuthProvider.
| 3. Render App.jsx.
|
--------------------------------------------------------------
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

/*
--------------------------------------------------------------
| Authentication Provider
--------------------------------------------------------------
|
| AuthProvider gives the entire application access to:
|
| - logged-in user
| - JWT token
| - login()
| - logout()
| - authentication status
|
--------------------------------------------------------------
*/

import { AuthProvider } from "./context/AuthContext.jsx";

/*
--------------------------------------------------------------
| Create React Root
--------------------------------------------------------------
|
| document.getElementById("root") finds the HTML element
| inside index.html where React will be mounted.
|
--------------------------------------------------------------
*/

createRoot(document.getElementById("root")).render(

    <StrictMode>

        {/* 
        ------------------------------------------------------
        | AuthProvider
        ------------------------------------------------------
        |
        | Everything inside AuthProvider can use:
        |
        | useAuth()
        |
        ------------------------------------------------------
        */}

        <AuthProvider>

            <App />

        </AuthProvider>

    </StrictMode>
);