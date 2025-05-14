import { Request, Response } from "express";
import { generateSpeech, listVoices } from "../services/googleTTS.service";
import { AppError } from "../middleware/errorHandler";
import { TTSRequest, TTSResponse, VoiceResponse } from "../models/tts.model";

export const generateTTS = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      text,
      languageCode,
      voiceName,
      ssmlGender,
      audioEncoding,
    }: TTSRequest = req.body;

    if (!text) {
      throw new AppError("Text is required", 400);
    }

    const { filePath, audioBlob } = await generateSpeech({
      text,
      languageCode,
      voiceName,
      ssmlGender,
      audioEncoding,
    });

    const response: TTSResponse = {
      status: "success",
      data: {
        audioPath: filePath,
        audioBlob,
      },
    };

    res.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to synthesize speech: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};

export const getVoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { languageCode } = req.query;
    const voices = await listVoices(languageCode as string | undefined);

    const response: VoiceResponse = {
      status: "success",
      data: {
        voices,
      },
    };

    res.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to list voices: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
