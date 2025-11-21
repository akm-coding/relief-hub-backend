import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Custom Middleware and Utils
import errorHandler from "./middleware/errorHandler";
import { NotFoundError } from "./utils/httpErrors";

// Import All Routes
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
// import hazardZoneRoutes from "./modules/hazard-zones/hazard-zones.routes";
// import warningRoutes from "./modules/warnings/warnings.routes";
// import checklistRoutes from "./modules/checklist/checklist.routes";
// import drillRoutes from "./modules/drills/drills.routes";
// import incidentRoutes from "./modules/incidents/incidents.routes";
// import aidRequestRoutes from "./modules/aid-requests/aid-requests.routes";
// import assignmentRoutes from "./modules/assignments/assignments.routes";
// import shelterRoutes from "./modules/shelters/shelters.routes";
// import assessmentRoutes from "./modules/assessments/assessments.routes";
// import inventoryRoutes from "./modules/inventory/inventory.routes";
// import resourceLogRoutes from "./modules/resource-logs/resource-logs.routes";
// import messagingRoutes from "./modules/messaging/messaging.routes";
// import responderRoutes from "./modules/responders/responders.routes";

const app = express();

// Global Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json()); // For parsing application/json

// --- API Routes ---
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Unified Disaster Management Backend",
    version: "v1",
  });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  next(new NotFoundError(`The resource at ${req.originalUrl} was not found.`));
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
