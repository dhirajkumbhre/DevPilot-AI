/*
--------------------------------------------------------------
File        : server.js
Project     : DevPilot AI
--------------------------------------------------------------

Purpose:
Starts the backend server and establishes the MongoDB
database connection.
--------------------------------------------------------------
*/

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

/*
--------------------------------------------------------------
Load Environment Variables
--------------------------------------------------------------
*/

dotenv.config();

/*
--------------------------------------------------------------
Server Configuration
--------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

/*
--------------------------------------------------------------
Start Server
--------------------------------------------------------------
*/

const startServer = async () => {
    try {
        /*
        Connect to MongoDB before starting the API server.
        */

        await connectDB();

        /*
        Start Express server.
        */

        app.listen(PORT, () => {
            console.log(`🚀 DevPilot AI server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};

/*
--------------------------------------------------------------
Initialize Application
--------------------------------------------------------------
*/

startServer();