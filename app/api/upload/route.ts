import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("AI API key is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        court_orders: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              "Case ID": { type: SchemaType.STRING },
              "Court Order Date": { type: SchemaType.STRING },
              "Court Location": { type: SchemaType.STRING },
              "Victim_Statement": { type: SchemaType.STRING },
              "Plaintiff Age": { type: SchemaType.STRING },
              "Plaintiff Gender": { type: SchemaType.STRING },
              "Perpetrator_Statement": { type: SchemaType.STRING },
              "Defendant Age": { type: SchemaType.STRING },
              "Defendant Gender": { type: SchemaType.STRING },
              "Charge/Offense": { type: SchemaType.STRING },
              "Court Ruling": { type: SchemaType.STRING },
              "Sentence/Fine": { type: SchemaType.STRING },
              "Court Action": { type: SchemaType.STRING },
              "Evidence_Summary": { type: SchemaType.STRING },
              "Status": { type: SchemaType.STRING },
              "Recurrence": { type: SchemaType.STRING },
            },
            required: [
              "Case ID",
              "Court Order Date",
              "Court Location",
              "Victim_Statement",
              "Plaintiff Age",
              "Plaintiff Gender",
              "Perpetrator_Statement",
              "Defendant Age",
              "Defendant Gender",
              "Charge/Offense",
              "Court Ruling",
              "Sentence/Fine",
              "Court Action",
              "Evidence_Summary",
              "Status",
              "Recurrence",
            ],
          },
        },
      },
      required: ["court_orders"],
    },
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

const systemInstruction =
"You are an expert in extracting structured data from unstructured or semi-structured text in court orders. "
"Given a file (image, PDF, DOCX, CSV, etc.) containing one or more court orders, extract data into the following fields "
"in English only, translating or transliterating any non-English content (e.g., Sinhala) into English. Ensure all fields are included, "
"even if the value is 'Unknown'. Do not extract personal names to protect privacy: "
"- Case ID (e.g., '2024-059', 'Case No. 123-2023', or a number like '862') "
"- Court Order Date (e.g., '2025.02.25', 'February 25, 2025') "
"- Court Location (e.g., 'Houston District Court', 'Colombo Central Court', or 'Unknown'; translate to English, e.g., 'Halawatha Magistrate's Court') "
"- Victim_Statement (e.g., 'Alleged domestic violence incident', or 'Unknown'; summarize the victim's complaint or allegations in English) "
"- Plaintiff Age (e.g., '42', '20 years', or 'Unknown') "
"- Plaintiff Gender (e.g., 'Male', 'Female', or 'Unknown') "
"- Perpetrator_Statement (e.g., 'Denied allegations', or 'Unknown'; summarize the accused’s response or defense in English, if present) "
"- Defendant Age (e.g., '40', '28 years', or 'Unknown') "
"- Defendant Gender (e.g., 'Female', 'Male', or 'Unknown') "
"- Charge/Offense (e.g., 'Fraud', 'Assault', or 'Unknown'; translate to English, e.g., 'Sections 2(2) (a and b) and Section 2(3) of Act No. 34 of 2005') "
"- Court Ruling (e.g., 'Convicted', 'Dismissed', or 'Unknown'; translate to English, e.g., 'Request dismissed') "
"- Sentence/Fine (e.g., '$5,000 fine', '6 months probation', '800', or 'Unknown') "
"- Court Action (e.g., 'Restraining order issued', 'Community service ordered', or 'Unknown'; translate to English, e.g., 'Defendants discharged from the case') "
"- Evidence_Summary (e.g., 'No physical evidence presented', or 'Unknown'; summarize any mentioned evidence in English) "
"- Status (e.g., 'Closed', 'Pending Appeal', 'Active', or 'Unknown') "
"- Recurrence (e.g., 'First-time offense', 'Repeat offender', or 'Unknown') "
"Guidelines: "
"1. For Case ID, look for identifiers like 'Case No.', 'Case Number', or a standalone number (e.g., '862'). If unclear, use 'Unknown'. "
"2. For Court Order Date, identify dates (e.g., '2025.02.25', 'February 25, 2025', '2021.1.17'). Use the most recent date if multiple are present. "
"3. For Court Location, translate any non-English text to English (e.g., 'Halawatha Magistrate's Court'); if unclear, use 'Unknown'. "
"4. For Victim_Statement, summarize the victim's allegations or complaint in English (e.g., 'Reported domestic violence'); if unclear, use 'Unknown'. "
"5. For Ages, extract numbers or phrases like '20 years'; if unclear, use 'Unknown'. "
"6. For Genders, infer from context if possible (e.g., feminine names as 'Female'); if unclear, use 'Unknown'. "
"7. For Perpetrator_Statement, summarize the accused’s defense or response in English (e.g., 'Denied allegations'); if unclear or absent, use 'Unknown'. "
"8. For Charge/Offense, translate legal terms to English (e.g., 'Sections 2(2) (a and b) and Section 2(3) of Act No. 34 of 2005'); if unclear, use 'Unknown'. "
"9. For Court Ruling, translate to English (e.g., 'Request dismissed'); if unclear, use 'Unknown'. "
"10. For Sentence/Fine, extract monetary values or terms like 'probation'; if unclear, use 'Unknown'. "
"11. For Court Action, translate to English (e.g., 'Defendants discharged from the case'); if unclear, use 'Unknown'. "
"12. For Evidence_Summary, summarize any evidence mentioned in English (e.g., 'No evidence provided'); if unclear or absent, use 'Unknown'. "
"13. For Status, infer from context (e.g., 'Dismissed' might imply 'Closed'); if unclear, use 'Unknown'. "
"14. For Recurrence, look for phrases like 'First-time offense'; if unclear, use 'Unknown'. "
"Handle OCR errors (e.g., '∞', repeated '2005') by focusing on unique, meaningful data. Extract multiple court orders if present. Output all fields in English only.";


const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
    safetySettings,
    systemInstruction
} as any);

async function fileToGenerativePart(file: File) {
    const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString("base64");
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file found" }, { status: 400 });
        }
        
        const imagePart = await fileToGenerativePart(file);

        const prompt = "Please extract the information from this document based on the system instructions.";

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();

        return NextResponse.json(JSON.parse(text));
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
