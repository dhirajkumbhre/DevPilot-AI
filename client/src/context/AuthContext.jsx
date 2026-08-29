/*
|--------------------------------------------------------------------------
| Authentication Context
|--------------------------------------------------------------------------
*/

import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    loginUser,
} from "../services/auth.service.js";


const AuthContext = createContext();


/*
|--------------------------------------------------------------------------
| Auth Provider
|--------------------------------------------------------------------------
*/

export const AuthProvider = ({ children }) => {

    /*
    ----------------------------------------------------------
    | Restore JWT from localStorage
    ----------------------------------------------------------
    */

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );


  const [user, setUser] = useState(() => {

    const storedUser =
        localStorage.getItem("user");

    return storedUser
        ? JSON.parse(storedUser)
        : null;
});

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const login = async (credentials) => {

        const data =
            await loginUser(credentials);


setUser(data.user);

setToken(data.token);

localStorage.setItem(
    "token",
    data.token
);

localStorage.setItem(
    "user",
    JSON.stringify(data.user)
);


        return data;
    };


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem("token");

    localStorage.removeItem("user");
};


    /*
    |--------------------------------------------------------------------------
    | Context Value
    |--------------------------------------------------------------------------
    */

    const value = {

        user,

        token,

        login,

        logout,

        isAuthenticated:
            Boolean(token),

    };


    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>
    );
};


/*
|--------------------------------------------------------------------------
| useAuth Hook
|--------------------------------------------------------------------------
*/

export const useAuth = () => {

    return useContext(AuthContext);

};