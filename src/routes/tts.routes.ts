import { Router } from "express";
import { generateTTS, getVoices } from "../controllers/tts.controller";

const router = Router();

// Get list of available voices
router.get("/voices", getVoices);

// Generate speech
router.post("/synthesize", generateTTS);

export default router;
