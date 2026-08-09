/*
--------------------------------------------------------------
| Authentication Context
--------------------------------------------------------------
|
| This file manages authentication information for the
| entire React application.
|
| Instead of keeping the logged-in user inside only one
| component, React Context allows multiple components to
| access the same authentication state.
|
| We will store:
|
| 1. The logged-in user
| 2. The JWT token
| 3. Whether the user is authenticated
| 4. Login function
| 5. Logout function
|
--------------------------------------------------------------
*/

import { createContext, useContext, useState } from "react";

import {
    loginUser,
} from "../services/auth.service.js";

/*
--------------------------------------------------------------
| Create Authentication Context
--------------------------------------------------------------
|
| The Context acts like a shared authentication container.
|
--------------------------------------------------------------
*/

const AuthContext = createContext();

/*
--------------------------------------------------------------
| Auth Provider
--------------------------------------------------------------
|
| Every component placed inside this provider can access
| authentication information.
|
| We will place this provider around our application in
| main.jsx.
|
--------------------------------------------------------------
*/

export const AuthProvider = ({ children }) => {

    /*
    ----------------------------------------------------------
    | Current User
    ----------------------------------------------------------
    |
    | Initially there is no logged-in user.
    |
    ----------------------------------------------------------
    */

    const [user, setUser] = useState(null);

    /*
    ----------------------------------------------------------
    | JWT Token
    ----------------------------------------------------------
    |
    | The token is received from our backend after login.
    |
    ----------------------------------------------------------
    */

    const [token, setToken] = useState(null);

    /*
    ----------------------------------------------------------
    | Login
    ----------------------------------------------------------
    |
    | This function will:
    |
    | 1. Send email/password to backend
    | 2. Receive user + JWT
    | 3. Store them in React state
    |
    ----------------------------------------------------------
    */

    const login = async (credentials) => {

        // Call our authentication API service.
        const data = await loginUser(credentials);

        /*
        ------------------------------------------------------
        | Store Authentication Data
        ------------------------------------------------------
        |
        | Backend response contains:
        |
        | data.user
        | data.token
        |
        ------------------------------------------------------
        */

        setUser(data.user);
        setToken(data.token);

        /*
        ------------------------------------------------------
        | Store JWT in localStorage
        ------------------------------------------------------
        |
        | localStorage allows the browser to remember the
        | token even after refreshing the page.
        |
        ------------------------------------------------------
        */

        localStorage.setItem("token", data.token);

        return data;
    };

    /*
    ----------------------------------------------------------
    | Logout
    ----------------------------------------------------------
    |
    | When the user logs out:
    |
    | 1. Remove user from React state
    | 2. Remove JWT from React state
    | 3. Remove JWT from localStorage
    |
    ----------------------------------------------------------
    */

    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("token");
    };

    /*
    ----------------------------------------------------------
    | Context Value
    ----------------------------------------------------------
    |
    | Everything inside this object becomes available to
    | components using useAuth().
    |
    ----------------------------------------------------------
    */

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
    };

    /*
    ----------------------------------------------------------
    | Provide Authentication Data
    ----------------------------------------------------------
    */

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/*
--------------------------------------------------------------
| useAuth Hook
--------------------------------------------------------------
|
| Instead of writing:
|
| useContext(AuthContext)
|
| in every component, we can simply write:
|
| const { user, login, logout } = useAuth();
|
--------------------------------------------------------------
*/

export const useAuth = () => {

    return useContext(AuthContext);
};