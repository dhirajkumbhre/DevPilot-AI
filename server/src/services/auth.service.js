import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

/*
--------------------------------------------------------------
Register User
--------------------------------------------------------------

This function contains the business logic for registration.

Flow:
1. Check whether the email already exists.
2. Hash the user's password.
3. Create the user in MongoDB.
4. Generate a JWT token.
5. Return safe user information + token.

The password is NEVER returned to the client.
--------------------------------------------------------------
*/

export const registerUserService = async ({
    name,
    email,
    password,
}) => {

    /*
    Check whether a user with this email already exists.

    We do this BEFORE creating the user so that the same
    email cannot be registered multiple times.
    */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    /*
    ----------------------------------------------------------
    Password Hashing
    ----------------------------------------------------------

    We should NEVER store the user's real password in MongoDB.

    Example:

    User enters:
        myPassword123

    We store something like:
        $2b$10$...

    bcrypt converts the original password into a secure hash.

    "10" is the salt-rounds/cost factor.
    ----------------------------------------------------------
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    Create the user in MongoDB.

    Notice that we store `hashedPassword`, NOT `password`.
    */

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    /*
    ----------------------------------------------------------
    JWT Token
    ----------------------------------------------------------

    After registration, we generate a JWT containing the
    user's identity.

    The frontend can use this token to prove that the user
    is authenticated when accessing protected APIs.
    ----------------------------------------------------------
    */

    const token = generateToken(user._id);

    /*
    Return only information that the frontend actually needs.

    IMPORTANT:
    We deliberately do NOT return user.password.
    */

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};


/*
--------------------------------------------------------------
Login User
--------------------------------------------------------------

This function handles authentication for an existing user.

Flow:

Email + Password
       ↓
Find user
       ↓
Compare password with bcrypt
       ↓
Generate JWT
       ↓
Return user + token
--------------------------------------------------------------
*/

export const loginUserService = async ({
    email,
    password,
}) => {

    /*
    Find the user using their email address.
    */

    const user = await User.findOne({ email });

    /*
    We intentionally use the same error message for an
    unknown email and an incorrect password.

    This prevents revealing whether a particular email
    is registered.
    */

    if (!user) {
        throw new Error("Invalid email or password");
    }

    /*
    ----------------------------------------------------------
    Password Verification
    ----------------------------------------------------------

    bcrypt.compare() takes:

    1. The plain password entered by the user.
    2. The hashed password stored in MongoDB.

    It returns true if they match.
    ----------------------------------------------------------
    */

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    /*
    Password is correct.

    Generate a new JWT so the user can access protected
    resources.
    */

    const token = generateToken(user._id);

    /*
    Return safe user information and the authentication token.

    Again, NEVER send the password back to the frontend.
    */

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};