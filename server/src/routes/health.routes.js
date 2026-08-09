/*
|--------------------------------------------------------------------------
| Health Routes
|--------------------------------------------------------------------------
| Provides a simple endpoint to check whether the backend is running.
|--------------------------------------------------------------------------
*/

import express from "express";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
| GET /api/health
|
| Returns a simple success response when the server is healthy.
|--------------------------------------------------------------------------
*/
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevPilot AI backend is healthy"
    });
});

/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
| app.js imports this router as the default export.
|--------------------------------------------------------------------------
*/
export default router;