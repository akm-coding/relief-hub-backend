import app from "./app";
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 8000;

// Function to start the server and connect to the database
async function startServer() {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("✅ Database connected successfully.");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server or connect to database:", error);
    process.exit(1); // Exit process with failure
  }
}

startServer();
