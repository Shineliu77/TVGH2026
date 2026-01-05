import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

export const chatWithAI = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  // Always initialize a new GoogleGenAI instance inside the function to ensure the current API_KEY is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use ai.chats.create to start a chat session with the provided history.
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是一位專業的健康助教，擅長鼓勵病患並提供簡單明了的健康建議。請使用繁體中文回答。如果用戶提到嚴重症狀，請委婉地建議他們諮詢醫生。你的語氣應該充滿關懷與耐心。",
    },
    // Maintain chat history for multi-turn conversation context.
    history: history,
  });

  // chat.sendMessage only accepts the message parameter.
  const response = await chat.sendMessage({ message });
  // The GenerateContentResponse object features a text property (not a method).
  return response.text;
};

export const generateHealthAdvice = async (patientData: string) => {
  // Always initialize a new GoogleGenAI instance inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `根據以下病患數據，提供一條簡短且具備激勵性的健康建議：${patientData}`,
    config: {
      systemInstruction: "你是一位充滿活力的健康教練。",
    }
  });
  // The GenerateContentResponse object features a text property (not a method).
  return response.text;
};

/**
 * Manual implementation of base64 decoding.
 * The audio bytes returned by the Live API is raw PCM data.
 */
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Custom audio data decoding for raw PCM streams.
 * Do not use the browser's native AudioContext.decodeAudioData for raw streams.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Manual implementation of base64 encoding.
 */
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}