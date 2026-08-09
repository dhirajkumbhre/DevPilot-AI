/*
|--------------------------------------------------------------------------
| Authentication Controller
|--------------------------------------------------------------------------
| Handles HTTP requests related to user authentication.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
| POST /api/auth/register
|
| This controller will later connect to the authentication service
| and create a user in MongoDB.
|--------------------------------------------------------------------------
*/
export const registerUser = async (req, res) => {
    try {
        // Get user information from the request body
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Temporary response
        // We will connect this to MongoDB/auth service next.
        return res.status(201).json({
            success: true,
            message: "User registration endpoint is working",
            user: {
                name,
                email
            }
        });

    } catch (error) {
        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| POST /api/auth/login
|
| This controller will later verify the user's password
| and generate a JWT token.
|--------------------------------------------------------------------------
*/
export const loginUser = async (req, res) => {
    try {
        // Get login credentials from request body
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Temporary response
        // JWT authentication will be connected next.
        return res.status(200).json({
            success: true,
            message: "User login endpoint is working",
            user: {
                email
            }
        });

    } catch (error) {
        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};