/**
 * ElevenLabs Service – Speech‑to‑Text & Text‑to‑Speech
 *
 * This module is written for a modern TypeScript stack (React + Node) and
 * follows strict typing, Vite environment handling, and safe API usage.
 *
 * The public API mirrors the original behaviour:
 *   - `speechToText(blob)` → transcribed text
 *   - `textToSpeech(text)` → HTMLAudioElement (browser) or Buffer (Node)
 *
 * Environment variables (Vite):
 *   - VITE_ELEVENLABS_API_KEY – ElevenLabs API key
 *   - VITE_ELEVENLABS_VOICE_ID – Voice identifier (default: "ID")
 */

type STTResponse = {
  text?: string;
};

type VoiceSettings = {
  stability: number;
  similarity_boost: number;
};

type TTSRequestBody = {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
};

type TTSResponse = Blob;

/**
 * Custom error type for ElevenLabs API failures.
 */
export class ElevenLabsError extends Error {
  public readonly status: number;
  public readonly payload?: string;

  constructor(message: string, status: number, payload?: string) {
    super(message);
    this.name = "ElevenLabsError";
    this.status = status;
    this.payload = payload;
  }
}

/** API key – pulled from Vite env (fallback to empty string for safety). */
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY ?? "";
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID ?? "ID";

/**
 * Convert an audio Blob (e.g., from a microphone) to transcribed text.
 *
 * @param audioBlob - The audio data to send to ElevenLabs.
 * @returns The transcribed text, or an empty string if the blob is empty.
 * @throws ElevenLabsError on non‑2xx responses.
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
  if (audioBlob.size === 0) {
    console.warn("Empty audio blob received");
    return "";
  }

  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");
  form.append("model_id", "scribe_v1");

  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Scribe API Error:", errorText);
    throw new ElevenLabsError(
      `Scribe API Error: ${response.status}`,
      response.status,
      errorText,
    );
  }

  const data: STTResponse = await response.json();
  return data.text ?? "";
}

/**
 * Convert text to speech using ElevenLabs.
 *
 * In a browser environment the function resolves to an `HTMLAudioElement`.
 * In a Node environment it resolves to a `Buffer` containing the audio data.
 *
 * @param text - The text to synthesize.
 * @returns An audio element (browser) or Buffer (Node) with the spoken output.
 * @throws ElevenLabsError on non‑2xx responses.
 */
export async function textToSpeech(text: string): Promise<HTMLAudioElement | Buffer> {
  const body: TTSRequestBody = {
    text,
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8,
    },
  };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("TTS API Error:", errorText);
    throw new ElevenLabsError(
      `TTS API Error: ${response.status}`,
      response.status,
      errorText,
    );
  }

  const audioBlob = await response.blob();

  // Detect runtime environment – Node (no window) vs Browser.
  if (typeof window === "undefined" || typeof Audio === "undefined") {
    // Node: return a Buffer for downstream processing.
    const arrayBuffer = await audioBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Browser: create an HTMLAudioElement.
  const audioUrl = URL.createObjectURL(audioBlob);
  return new Audio(audioUrl);
}