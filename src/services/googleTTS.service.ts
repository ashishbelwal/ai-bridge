import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as path from "path";
import { AppError } from "../middleware/errorHandler";

// Types
interface TTSRequest {
  text: string;
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: protos.google.cloud.texttospeech.v1.SsmlVoiceGender;
  audioEncoding?: protos.google.cloud.texttospeech.v1.AudioEncoding;
}

type VoiceGender =
  | protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE
  | protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE
  | protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;

interface Voice {
  name: string;
  languageCodes: string[];
  gender: VoiceGender;
  naturalSampleRateHertz: number;
}

// Creates a Google Cloud Text-to-Speech client
const client = new TextToSpeechClient();

// Ensure output directory exists
const OUTPUT_DIR = path.join(__dirname, "../../output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const isValidVoice = (voice: any): voice is Voice => {
  const validGenders = [
    protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE,
    protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
    protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
  ];

  return (
    voice &&
    typeof voice.name === "string" &&
    Array.isArray(voice.languageCodes) &&
    validGenders.includes(voice.ssmlGender) &&
    typeof voice.naturalSampleRateHertz === "number"
  );
};

export const listVoices = async (languageCode?: string): Promise<Voice[]> => {
  try {
    const [response] = await client.listVoices({
      languageCode,
    });

    if (!response.voices) {
      return [];
    }

    const validVoices = response.voices
      .map((voice) => ({
        name: voice.name || "",
        languageCodes: voice.languageCodes || [],
        gender:
          voice.ssmlGender ||
          protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        naturalSampleRateHertz: voice.naturalSampleRateHertz || 24000,
      }))
      .filter(isValidVoice);

    return validVoices;
  } catch (error) {
    throw new AppError(
      `Failed to list voices: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};

export const generateSpeech = async ({
  text,
  languageCode = "en-US",
  voiceName,
  ssmlGender = protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
  audioEncoding = protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
}: TTSRequest): Promise<string> => {
  try {
    const request = {
      input: { text },
      voice: voiceName ? { name: voiceName } : { languageCode, ssmlGender },
      audioConfig: { audioEncoding },
    };

    // Perform the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new AppError("No audio content received from Google TTS", 500);
    }

    // Generate unique filename using timestamp
    const timestamp = new Date().getTime();
    const filename = `speech-${timestamp}.mp3`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Write audio content to file
    fs.writeFileSync(outputPath, response.audioContent, "binary");

    // Return a web-friendly path
    return `/audio/${filename}`;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to generate speech: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
