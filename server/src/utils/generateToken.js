/*
--------------------------------------------------------------
File        : generateToken.js
Project     : DevPilot AI
--------------------------------------------------------------

Purpose:
Creates a JSON Web Token (JWT) for an authenticated user.

JWT is used by our backend to identify a user after they
successfully register or log in.

Flow:

User logs in
    ↓
Password verified
    ↓
generateToken(user._id)
    ↓
JWT created
    ↓
Token sent to client
    ↓
Client uses token for protected API requests
--------------------------------------------------------------
*/

import jwt from "jsonwebtoken";

/*
--------------------------------------------------------------
Generate JWT Token
--------------------------------------------------------------

userId:
The MongoDB ID of the authenticated user.

We put the ID inside the JWT payload so that later our
authentication middleware can identify which user is making
the request.
--------------------------------------------------------------
*/

const generateToken = (userId) => {

    /*
    jwt.sign() creates a signed JWT.

    It takes three main arguments:

    1. Payload
       Information we want to store inside the token.

    2. Secret key
       Used to sign the token.

       IMPORTANT:
       The secret comes from .env and should NEVER be
       hard-coded or committed to GitHub.

    3. Options
       Configuration such as token expiration.
    */

    return jwt.sign(
        {
            // Store the user's MongoDB ID in the JWT payload.
            userId,
        },

        /*
        JWT secret.

        This comes from:

        JWT_SECRET=your-secret-key

        in the .env file.
        */

        process.env.JWT_SECRET,

        {
            /*
            The token becomes invalid after 7 days.

            Later we can change this depending on the
            authentication strategy we choose.
            */

            expiresIn: "7d",
        }
    );
};

/*
--------------------------------------------------------------
Export
--------------------------------------------------------------
*/

export default generateToken;