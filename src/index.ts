import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { cleanupOldFiles } from "./utils/cleanup";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the output directory
app.use("/audio", express.static(path.join(__dirname, "../output")));

// Routes
app.use("/api", routes);
app.use("/api/tts", routes);

// Error handling
app.use(errorHandler);

// Clean up old files every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Initial cleanup
  cleanupOldFiles();
});
