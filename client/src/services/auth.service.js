/*
|--------------------------------------------------------------------------
| Authentication Service
|--------------------------------------------------------------------------
*/

const API_URL =
    "http://localhost:5000/api/auth";


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(userData),
        }
    );


    const responseData =
        await response.json();


    if (!response.ok) {

        throw new Error(
            responseData.message ||
            "Registration failed"
        );
    }


    return responseData.data;
};


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export const loginUser = async (credentials) => {

    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(credentials),
        }
    );


    const responseData =
        await response.json();


    if (!response.ok) {

        throw new Error(
            responseData.message ||
            "Login failed"
        );
    }


    return responseData.data;
};