import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const generationConfig = {
  temperature: 0.5,
  topP: 1,
  topK: 1,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const getGenerativeModel = (responseSchema?: any, systemInstruction?: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const modelParams: any = {
    model: "gemini-2.0-flash",
    generationConfig: {
      ...generationConfig,
      responseMimeType: responseSchema ? "application/json" : "text/plain",
    },
    safetySettings,
  };

  if (systemInstruction) {
    modelParams.systemInstruction = {
      role: "user",
      parts: [{ text: systemInstruction }],
    };
  }
  
  const model = genAI.getGenerativeModel(modelParams);

  if (responseSchema) {
    // This is a workaround for a bug in the library's types
    (model.generationConfig as any).responseSchema = responseSchema;
  }

  return model;
};