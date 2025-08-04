import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getGenerativeModel } from "@/lib/gemini";
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("AI API key is not set");
}

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
          "caseId", "incidentDate", "reportDate", "victimName", "victimAge", "victimGender",
          "victimNationality", "perpetratorName", "perpetratorGender", "perpetratorNationality",
          "relationshipToVictim", "incidentLocation", "incidentSummary", "typeOfViolence",
          "injuryDescription", "evidenceMentioned", "reportedToAuthorities", "actionTaken",
          "recurrence", "caseStatus", "relevantLaws", "incidentTime", "priorCriminalHistory"
        ],
        properties: {
          caseId: { type: "string" },
          incidentDate: { type: "string" },
          reportDate: { type: "string" },
          victimName: { type: "string" },
          victimAge: { type: "string" },
          victimGender: { type: "string" },
          victimNationality: { type: "string" },
          perpetratorName: { type: "string" },
          perpetratorGender: { type: "string" },
          perpetratorNationality: { type: "string" },
          relationshipToVictim: { type: "string" },
          incidentLocation: { type: "string" },
          incidentSummary: { type: "string" },
          typeOfViolence: { type: "string" },
          injuryDescription: { type: "string" },
          evidenceMentioned: { type: "string" },
          reportedToAuthorities: { type: "string" },
          actionTaken: { type: "string" },
          recurrence: { type: "string" },
          caseStatus: { type: "string" },
          relevantLaws: { type: "string" },
          incidentTime: { type: "string" },
          priorCriminalHistory: { type: "string" },
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
"You are an expert in extracting structured data from unstructured or semi-structured text in police reports. Given a file (which may be an image, PDF, DOCX, CSV, or other format) containing one or more police reports, identify and extract data into the following fields:\n\n" +
"caseId (e.g., 'WCIB 367/04', 'BR 1082/25')\n" +
"incidentDate (e.g., 'February 27, 2025')\n" +
"incidentTime (e.g., '10:30 AM', '14:45', or 'Unknown')\n" +
"reportDate (e.g., 'March 1, 2025')\n" +
"victimName (e.g., 'Alina Oslopova' or leave 'Unknown' if redacted)\n" +
"victimAge (e.g., '25 years', or 'Unknown')\n" +
"victimGender (e.g., 'Female', 'Male', 'Unknown')\n" +
"victimNationality (e.g., 'Sri Lankan', 'Russian', or 'Unknown')\n" +
"perpetratorName (e.g., include if mentioned; else 'Unknown')\n" +
"perpetratorGender (e.g., 'Female', 'Male', 'Unknown')\n" +
"perpetratorNationality (e.g., 'Sri Lankan', 'Russian', or 'Unknown')\n" +
"relationshipToVictim (e.g., 'Spouse', 'Stranger', 'Friend', 'Employer', 'Unknown')\n" +
"incidentLocation (e.g., 'No. 39/3C, Kaluwella, Galle')\n" +
"incidentSummary (a detailed summary of the incident, including key events and context)\n" +
"typeOfViolence (e.g., 'Physical assault', 'Verbal threat', 'Sexual harassment', 'Unknown')\n" +
"injuryDescription (if any: e.g., 'swollen cheek', 'bleeding nose')\n" +
"evidenceMentioned (e.g., 'Medical Report', 'CCTV footage', 'Police Scene Report')\n" +
"reportedToAuthorities ('Yes', 'No')\n" +
"actionTaken (e.g., 'Victim taken to hospital', 'CCTV retrieved', 'Suspect summoned')\n" +
"recurrence (e.g., 'First-time incident', 'Repeat incident', 'Ongoing domestic violence')\n" +
"caseStatus (e.g., 'Ongoing', 'Referred to court', 'Concluded', 'Unknown')\n" +
"relevantLaws (e.g., 'Sri Lanka Penal Code 314, 316', or 'Children's Charter 1989')\n" +
"priorCriminalHistory (e.g., 'No prior record', 'Convicted of theft in 2020', or 'Unknown')\n" +
"The text may not follow a consistent format, and some fields may be missing, ambiguous, or in a non-English language (e.g., Sinhala).\n\n" +
"Guidelines:\n" +
"1. For caseId, look for identifiers like 'WCIB', 'MCR/', 'BR', or similar (e.g., 'WCIB 367/04', 'MCR/122/25'); if unclear, use 'Unknown'.\n" +
"2. For incidentDate and reportDate, accept various formats (e.g., 'February 27, 2025', '2025-02-27') and distinguish between them. Translate Sinhala dates to English (e.g., 'පෙබරවාරි' to 'February').\n" +
"3. For victimName, extract as provided (e.g., 'Alina Oslopova', 'මලිකා'); if redacted or unclear, use 'Unknown'.\n" +
"4. For ages, extract numerical values or phrases like '25 years'; if not specified, use 'Unknown'.\n" +
"5. For gender, identify terms like 'Male', 'Female', or Sinhala equivalents (e.g., 'මහල' for 'Male'); if unclear, use 'Unknown'.\n" +
"6. For victimNationality and perpetratorNationality, infer from context (e.g., 'Sri Lankan' from location or name); if unclear, use 'Unknown'.\n" +
"7. For relationshipToVictim, infer from context (e.g., 'Spouse' in domestic cases, 'Stranger' in theft); translate if in Sinhala; if unclear, use 'Unknown'.\n" +
"8. For incidentLocation, extract full address or place (e.g., 'No. 39/3C, Kaluwella, Galle'); if unclear, use 'Unknown'.\n" +
"9. For incidentSummary, provide a detailed English summary of the incident, including key events, actions, and context. Capture more than just the basic event; if unclear, use 'Unknown'.\n" +
"10. For typeOfViolence, use specified terms (e.g., 'Physical assault', 'Verbal threat') or infer from narrative; translate if necessary; if unclear, use 'Unknown'.\n" +
"11. For injuryDescription, extract any mentioned injuries (e.g., 'swollen cheek'); if none or unclear, use 'Unknown'.\n" +
"12. For evidenceMentioned, list any evidence noted (e.g., 'Medical Report', 'CCTV footage'); if none or unclear, use 'Unknown'.\n" +
"13. For reportedToAuthorities, assume 'Yes' if a police report exists, unless stated otherwise.\n" +
"14. For actionTaken, summarize police response (e.g., 'Victim taken to hospital'); translate if in Sinhala; if unclear, use 'Unknown'.\n" +
"15. For recurrence, look for phrases like 'First-time incident' or infer (e.g., 'Ongoing domestic violence'); translate if necessary; if unclear, use 'Unknown'.\n" +
"16. For caseStatus, infer from context (e.g., 'Ongoing', 'Referred to court'); translate if necessary; if unclear, use 'Unknown'.\n" +
"17. For relevantLaws, extract legal references (e.g., 'Sri Lanka Penal Code 314, 316'); translate if necessary; if unclear, use 'Unknown'.\n" +
"18. For incidentTime, extract time of incident if mentioned (e.g., '10:30 AM', '14:45'); if unclear or absent, use 'Unknown'.\n" +
"19. For priorCriminalHistory, extract any mention of past criminal records (e.g., 'No prior record', 'Convicted of theft in 2020'); if unclear or absent, use 'Unknown'.\n" +
"20. If the report is in a non-English language (e.g., Sinhala), translate relevant sections to English for extraction.\n" +
"21. If multiple cases are present, extract each as a separate entry. Ensure the extracted data aligns with the provided schema and is presented in English.";


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
        
        const model = getGenerativeModel(schema, systemInstruction);
        
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