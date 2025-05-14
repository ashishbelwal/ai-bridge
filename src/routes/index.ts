import { Router, Request, Response } from "express";
import ttsRoutes from "./tts.routes";

const router = Router();

// Health check route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// TTS routes
router.use("/tts", ttsRoutes);

export default router;
