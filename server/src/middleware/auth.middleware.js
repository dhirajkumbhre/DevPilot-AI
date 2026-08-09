/*
|--------------------------------------------------------------------------
| File        : auth.middleware.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Checks whether an incoming request contains a valid JWT.
|
| Middleware runs BETWEEN the request and the controller.
|
| Example:
|
| Request
|    ↓
| authenticateUser()
|    ↓
| Controller
|    ↓
| Response
|
|--------------------------------------------------------------------------
*/

import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
|
| This function protects routes that require a logged-in user.
|
| For example:
|
| GET /api/projects
|
| The user must send:
|
| Authorization: Bearer <JWT>
|
|--------------------------------------------------------------------------
*/

const authenticateUser = (req, res, next) => {

    try {

        /*
        --------------------------------------------------------------
        Get Authorization Header
        --------------------------------------------------------------

        The browser/Postman sends the JWT in the HTTP request
        headers.

        Example:

        Authorization: Bearer eyJhbGciOiJIUzI1Ni...
        --------------------------------------------------------------
        */

        const authHeader = req.headers.authorization;


        /*
        --------------------------------------------------------------
        Check Whether Authorization Header Exists
        --------------------------------------------------------------

        If the header doesn't exist, the user has not provided
        authentication credentials.

        We return HTTP 401 = Unauthorized.
        --------------------------------------------------------------
        */

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message: "Authentication required"

            });
        }


        /*
        --------------------------------------------------------------
        Extract JWT
        --------------------------------------------------------------

        The header looks like:

        "Bearer eyJhbGciOiJIUzI1Ni..."

        split(" ") creates:

        [
            "Bearer",
            "eyJhbGciOiJIUzI1Ni..."
        ]

        [1] gives us the actual token.
        --------------------------------------------------------------
        */

        const token = authHeader.split(" ")[1];


        /*
        --------------------------------------------------------------
        Verify JWT
        --------------------------------------------------------------

        jwt.verify() checks:

        1. Is the token correctly signed?
        2. Was it created using our JWT_SECRET?
        3. Has it expired?
        4. Is the token otherwise valid?

        If anything fails, an error is thrown and the catch
        block handles it.
        --------------------------------------------------------------
        */

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        /*
        --------------------------------------------------------------
        Store User Information
        --------------------------------------------------------------

        generateToken() originally stored:

        {
            userId: user._id
        }

        jwt.verify() gives that information back to us.

        We attach it to req.user so that controllers can
        identify the authenticated user.

        Example:

        req.user.userId
        --------------------------------------------------------------
        */

        req.user = decoded;


        /*
        --------------------------------------------------------------
        Continue Request
        --------------------------------------------------------------

        next() tells Express:

        "Authentication succeeded. Continue to the next
        middleware/controller."
        --------------------------------------------------------------
        */

        next();

    } catch (error) {

        /*
        --------------------------------------------------------------
        Authentication Failed
        --------------------------------------------------------------

        This can happen when:

        - Token is invalid
        - Token was modified
        - Token has expired
        - JWT_SECRET doesn't match
        - Token is malformed
        --------------------------------------------------------------
        */

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token"

        });
    }
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default authenticateUser;