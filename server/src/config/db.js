/*
--------------------------------------------------------------
File        : db.js
Project     : DevPilot AI
--------------------------------------------------------------

Purpose:
Creates and manages the connection between our Node.js
application and MongoDB.
--------------------------------------------------------------
*/

import mongoose from "mongoose";

/*
--------------------------------------------------------------
Connect to MongoDB
--------------------------------------------------------------
*/

const connectDB = async () => {
    try {
        /*
        ----------------------------------------------------------
        MongoDB Connection
        ----------------------------------------------------------

        MONGO_URI is stored inside our .env file.

        Example:

        MONGO_URI=mongodb+srv://...
        ----------------------------------------------------------
        */

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected successfully");

    } catch (error) {

        /*
        ----------------------------------------------------------
        Connection Error
        ----------------------------------------------------------
        */

        console.error(
            "❌ MongoDB Connection Failed:",
            error.message
        );

        /*
        ----------------------------------------------------------
        Stop Application
        ----------------------------------------------------------

        If the database is unavailable, there is no point
        running our backend API.
        ----------------------------------------------------------
        */

        process.exit(1);
    }
};

/*
--------------------------------------------------------------
Export
--------------------------------------------------------------
*/

export default connectDB;