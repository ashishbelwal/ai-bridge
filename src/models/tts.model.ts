import { protos } from "@google-cloud/text-to-speech";

export interface TTSRequest {
  text: string;
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: protos.google.cloud.texttospeech.v1.SsmlVoiceGender;
  audioEncoding?: protos.google.cloud.texttospeech.v1.AudioEncoding;
}

export interface TTSResponse {
  status: "success" | "error";
  data: {
    audioPath: string;
  };
}

export interface VoiceResponse {
  status: "success" | "error";
  data: {
    voices: Array<{
      name: string;
      languageCodes: string[];
      gender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender;
      naturalSampleRateHertz: number;
    }>;
  };
}
