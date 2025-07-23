import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getGenerativeModel } from "@/lib/gemini";
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("AI API key is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const courtOrderSchema = {
  type: "OBJECT",
  properties: {
    cases: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          caseId: { type: "string" },
          courtOrderDate: { type: "string" },
          courtLocation: { type: "string" },
          victimStatement: { type: "string" },
          plaintiffAge: { type: "string" },
          plaintiffGender: { type: "string" },
          perpetratorStatement: { type: "string" },
          defendantAge: { type: "string" },
          defendantGender: { type: "string" },
          chargeOffense: { type: "string" },
          courtRuling: { type: "string" },
          sentenceFine: { type: "string" },
          courtAction: { type: "string" },
          evidenceSummary: { type: "string" },
          status: { type: "string" },
          recurrence: { type: "string" },
        },
        required: [
          "caseId", "courtOrderDate", "courtLocation", "victimStatement",
          "plaintiffAge", "plaintiffGender", "perpetratorStatement",
          "defendantAge", "defendantGender", "chargeOffense", "courtRuling",
          "sentenceFine", "courtAction", "evidenceSummary", "status", "recurrence"
        ],
      },
    },
  },
  required: ["cases"],
};

const policeReportSchema = {
    type: "OBJECT",
    required: ["cases"],
    properties: {
        cases: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                required: [
                    "caseId", "incidentDate", "reportDate", "victimAge", "victimGender",
                    "victimRelationshipToPerpetrator", "perpetratorAge", "perpetratorGender",
                    "perpetratorRelationshipToVictim", "incidentLocation", "typeOfViolence",
                    "severityLevel", "reportedToAuthorities", "actionTaken", "recurrence",
                    "outcomeOfTheCase", "criminalStatus"
                ],
                properties: {
                    caseId: { type: "string" },
                    incidentDate: { type: "string" },
                    reportDate: { type: "string" },
                    victimAge: { type: "string" },
                    victimGender: { type: "string" },
                    victimRelationshipToPerpetrator: { type: "string" },
                    perpetratorAge: { type: "string" },
                    perpetratorGender: { type: "string" },
                    perpetratorRelationshipToVictim: { type: "string" },
                    incidentLocation: { type: "string" },
                    typeOfViolence: { type: "string" },
                    severityLevel: { type: "string" },
                    reportedToAuthorities: { type: "string" },
                    actionTaken: { type: "string" },
                    recurrence: { type: "string" },
                    outcomeOfTheCase: { type: "string" },
                    criminalStatus: { type: "string" },
                },
            },
        },
    },
};

const courtOrderSystemInstruction =
"You are an expert in extracting structured data from unstructured or semi-structured text in court orders. "
"Given a file (image, PDF, DOCX, CSV, etc.) containing one or more court orders, extract data into the following fields "
"in English only, translating or transliterating any non-English content (e.g., Sinhala) into English. Ensure all fields are included, "
"even if the value is 'Unknown'. Do not extract personal names to protect privacy: "
"- caseId (e.g., '2024-059', 'Case No. 123-2023', or a number like '862') "
"- courtOrderDate (e.g., '2025.02.25', 'February 25, 2025') "
"- courtLocation (e.g., 'Houston District Court', 'Colombo Central Court', or 'Unknown'; translate to English, e.g., 'Halawatha Magistrate's Court') "
"- victimStatement (e.g., 'Alleged domestic violence incident', or 'Unknown'; summarize the victim's complaint or allegations in English) "
"- plaintiffAge (e.g., '42', '20 years', or 'Unknown') "
"- plaintiffGender (e.g., 'Male', 'Female', or 'Unknown') "
"- perpetratorStatement (e.g., 'Denied allegations', or 'Unknown'; summarize the accused’s response or defense in English, if present) "
"- defendantAge (e.g., '40', '28 years', or 'Unknown') "
"- defendantGender (e.g., 'Female', 'Male', or 'Unknown') "
"- chargeOffense (e.g., 'Fraud', 'Assault', or 'Unknown'; translate to English, e.g., 'Sections 2(2) (a and b) and Section 2(3) of Act No. 34 of 2005') "
"- courtRuling (e.g., 'Convicted', 'Dismissed', or 'Unknown'; translate to English, e.g., 'Request dismissed') "
"- sentenceFine (e.g., '$5,000 fine', '6 months probation', '800', or 'Unknown') "
"- courtAction (e.g., 'Restraining order issued', 'Community service ordered', or 'Unknown'; translate to English, e.g., 'Defendants discharged from the case') "
"- evidenceSummary (e.g., 'No physical evidence presented', or 'Unknown'; summarize any mentioned evidence in English) "
"- status (e.g., 'Closed', 'Pending Appeal', 'Active', or 'Unknown') "
"- recurrence (e.g., 'First-time offense', 'Repeat offender', or 'Unknown') "
"Guidelines: "
"1. For caseId, look for identifiers like 'Case No.', 'Case Number', or a standalone number (e.g., '862'). If unclear, use 'Unknown'. "
"2. For courtOrderDate, identify dates (e.g., '2025.02.25', 'February 25, 2025', '2021.1.17'). Use the most recent date if multiple are present. "
"3. For courtLocation, translate any non-English text to English (e.g., 'Halawatha Magistrate's Court'); if unclear, use 'Unknown'. "
"4. For victimStatement, summarize the victim's allegations or complaint in English (e.g., 'Reported domestic violence'); if unclear, use 'Unknown'. "
"5. For Ages, extract numbers or phrases like '20 years'; if unclear, use 'Unknown'. "
"6. For Genders, infer from context if possible (e.g., feminine names as 'Female'); if unclear, use 'Unknown'. "
"7. For perpetratorStatement, summarize the accused’s defense or response in English (e.g., 'Denied allegations'); if unclear or absent, use 'Unknown'. "
"8. For chargeOffense, translate legal terms to English (e.g., 'Sections 2(2) (a and b) and Section 2(3) of Act No. 34 of 2005'); if unclear, use 'Unknown'. "
"9. For courtRuling, translate to English (e.g., 'Request dismissed'); if unclear, use 'Unknown'. "
"10. For sentenceFine, extract monetary values or terms like 'probation'; if unclear, use 'Unknown'. "
"11. For courtAction, translate to English (e.g., 'Defendants discharged from the case'); if unclear, use 'Unknown'. "
"12. For evidenceSummary, summarize any evidence mentioned in English (e.g., 'No evidence provided'); if unclear or absent, use 'Unknown'. "
"13. For status, infer from context (e.g., 'Dismissed' might imply 'Closed'); if unclear, use 'Unknown'. "
"14. For recurrence, look for phrases like 'First-time offense'; if unclear, use 'Unknown'. "
"Handle OCR errors (e.g., '∞', repeated '2005') by focusing on unique, meaningful data. Extract multiple court orders if present. Output all fields in English only.";

const policeReportSystemInstruction =
"You are an expert in extracting structured data from unstructured or semi-structured text in police reports. "
"Given a file (which may be an image, PDF, DOCX, CSV, or other format) containing one or more police reports, "
"identify and extract data into the following fields: "
"- caseId (e.g., '2023-001', '2024-045', or '2024-059') "
"- incidentDate (e.g., 'January 1, 2023', 'March 17, 2024') "
"- reportDate (e.g., 'January 2, 2023', 'March 19, 2024') "
"- victimAge (e.g., '25 years', '40', or 'Unknown') "
"- victimGender (e.g., 'Male', 'Female', or 'Unknown') "
"- victimRelationshipToPerpetrator (e.g., 'Partner', 'Spouse', 'Stranger', or 'Unknown') "
"- perpetratorAge (e.g., '30 years', 'Unknown') "
"- perpetratorGender (e.g., 'Male', 'Female', or 'Unknown') "
"- perpetratorRelationshipToVictim (e.g., 'Spouse', 'Partner', 'Stranger', or 'Unknown') "
"- incidentLocation (e.g., 'Colombo', 'Houston, TX', 'Main Street, Chicago') "
"- typeOfViolence (e.g., 'Physical assault', 'Fraud (Identity Theft)', 'Hit-and-run') "
"- severityLevel (e.g., 'Minor', 'High', 'Moderate', 'Severe', 'Life-threatening') "
"- reportedToAuthorities (e.g., 'Yes', 'No') "
"- actionTaken (e.g., 'Fraud report filed with bank', 'Perpetrator arrested', 'Public alert issued') "
"- recurrence (e.g., 'First-time offense', 'Repeat offense', 'Unknown') "
"- outcomeOfTheCase (e.g., 'Pending further investigation', 'Active Investigation', 'Dismissed') "
"- criminalStatus (e.g., 'Criminal charges active', 'Not a Criminal', 'Unknown') "
"The text may not follow a consistent format, and some fields may be missing, ambiguous, or in a non-English language (e.g., Sinhala). Use the following guidelines: "
"1. For caseId, look for identifiers like 'Case No.', 'Case Number', or similar (e.g., '2024-059', '2023-001'). "
"2. For dates, accept various formats (e.g., 'March 18, 2024', 'January 1, 2023') and distinguish between incident and report dates. If the date is in a non-English language, translate it to English (e.g., Sinhala month names to English equivalents). "
"3. For ages, extract numerical values or phrases like '25 years'; if not specified, use 'Unknown'. "
"4. For relationships, infer from context (e.g., 'Partner' or 'Spouse' in domestic cases, 'Stranger' in hit-and-run cases). Translate relationship terms if in a non-English language. "
"5. For typeOfViolence, use the incident type if specified (e.g., 'Fraud (Identity Theft)', 'Physical assault', 'Hit-and-run'); otherwise, infer from the narrative. Translate if necessary. "
"6. For severityLevel, use terms like 'Minor', 'High', or 'Severe' as specified; if unclear, infer from the narrative (e.g., 'minor leg injury' implies 'Minor'). Translate severity terms if in a non-English language. "
"7. For reportedToAuthorities, assume 'Yes' if a police report exists, unless stated otherwise. "
"8. For actionTaken, summarize the police response (e.g., 'Fraud report filed with bank', 'Perpetrator arrested'). Translate actions if in a non-English language. "
"9. For recurrence, look for phrases like 'First-time offense' or infer from context; use 'Unknown' if unclear. Translate recurrence terms if necessary. "
"10. For outcomeOfTheCase, use terms like 'Active Investigation', 'Pending', or 'Dismissed' based on the case status. Translate if in a non-English language. "
"11. For criminalStatus, infer from context (e.g., 'Criminal charges active' if charges are mentioned). Translate if necessary. "
"12. If the report is in a non-English language (e.g., Sinhala), translate the relevant sections to English to extract the required fields accurately. "
"13. If multiple cases are present, extract each as a separate entry. If a field is unclear or missing, use 'Unknown'. "
"Ensure the extracted data aligns with the provided schema and is presented in English.";


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
        const docType = formData.get("docType") as "courtOrder" | "policeReport" | null;

        if (!file || !docType) {
            return NextResponse.json({ error: "No file or document type found" }, { status: 400 });
        }

        const schema = docType === "courtOrder" ? courtOrderSchema : policeReportSchema;
        const systemInstruction = docType === "courtOrder" ? courtOrderSystemInstruction : policeReportSystemInstruction;

        const model = getGenerativeModel(schema);
        // This is a workaround for a bug in the library's types
        (model as any).systemInstruction = {
          role: "user",
          parts: [{ text: systemInstruction }],
        };
        
        const imagePart = await fileToGenerativePart(file);

        const prompt = "Please extract the information from this document based on the system instructions.";

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();

        const parsedData = JSON.parse(text);

        // Add unique IDs to each case
        if (parsedData.cases && Array.isArray(parsedData.cases)) {
          const documentId = uuidv4();
          parsedData.cases = parsedData.cases.map((c: any) => ({
            ...c,
            id: uuidv4(),
            documentId,
          }));
        }

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
