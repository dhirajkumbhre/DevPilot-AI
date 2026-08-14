/*
|--------------------------------------------------------------------------
| DevPilot AI Routes
|--------------------------------------------------------------------------
*/

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

router.post("/chat", chatWithAI);

export default router;