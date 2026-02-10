import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  baseURL: process.env.GOOGLE_CUSTOM_BASE_URL,
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const model = google("models/gemini-1.5-flash");
