/*
|--------------------------------------------------------------------------
| File        : auth.routes.js
| Project     : DevPilot AI
|--------------------------------------------------------------------------
|
| Purpose:
| Defines authentication-related API routes.
|
| Routes:
|
| POST /api/auth/register
| POST /api/auth/login
|
|--------------------------------------------------------------------------
*/

import express from "express";

import {
    registerUser,
    loginUser
} from "../controllers/auth.controller.js";


/*
|--------------------------------------------------------------------------
| Create Router
|--------------------------------------------------------------------------
|
| express.Router() allows us to group authentication routes
| separately from the rest of the application.
|
|--------------------------------------------------------------------------
*/

const router = express.Router();


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
|
| POST /api/auth/register
|
| Flow:
|
| Request
|    ↓
| registerUser controller
|    ↓
| registerUserService
|    ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

router.post(
    "/register",
    registerUser
);


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
|
| POST /api/auth/login
|
| Flow:
|
| Request
|    ↓
| loginUser controller
|    ↓
| loginUserService
|    ↓
| bcrypt
|    ↓
| JWT
|
|--------------------------------------------------------------------------
*/

router.post(
    "/login",
    loginUser
);


/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
|
| app.js imports this router and mounts it at:
|
| /api/auth
|
| Therefore:
|
| router.post("/register")
|
| becomes:
|
| POST /api/auth/register
|
|--------------------------------------------------------------------------
*/

export default router;