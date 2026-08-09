import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

/*
 * Load environment variables from .env
 */
dotenv.config();

const PORT = process.env.PORT || 5000;

/*
 * Start the application.
 *
 * First connect to MongoDB,
 * then start the Express server.
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();