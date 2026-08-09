import express from "express";

import {
    registerUser,
    loginUser
} from "../controllers/auth.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
| POST /api/auth/register
|
| Creates a new user account.
*/
router.post("/register", registerUser);

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| POST /api/auth/login
|
| Authenticates the user and returns a JWT.
*/
router.post("/login", loginUser);

/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
| app.js imports this router as the default export.
*/
export default router;