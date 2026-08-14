/*
|--------------------------------------------------------------------------
| DevPilot AI Routes
|--------------------------------------------------------------------------
*/

import authenticateUser from "../middleware/auth.middleware.js";

import express from "express";

import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CHAT WITH AI
|--------------------------------------------------------------------------
|
| POST /api/ai/chat
|
| Sends a message to the local Llama 3.2 model.
|
|--------------------------------------------------------------------------
*/

router.post(
    "/chat",
    authenticateUser,
    chatWithAI
);

export default router;