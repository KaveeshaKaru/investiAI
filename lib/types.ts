export type CourtCase = {
  id: string
  caseId: string
  courtOrderDate: string
  courtLocation: string
  victimStatement: string
  plaintiffAge: string
  plaintiffGender: string
  perpetratorStatement: string
  defendantAge: string
  defendantGender: string
  chargeOffense: string
  courtRuling: string
  sentenceFine: string
  courtAction: string
  evidenceSummary: string
  status: "closed" | "pending" | "active"
  recurrence: string
  documentId: string
}

export type PoliceReport = {
  id: string
  caseId: string
  incidentDate: string
  incidentTime: string
  reportDate: string
  victimName: string
  victimAge: string
  victimGender: string
  victimNationality: string
  perpetratorName: string
  perpetratorGender: string
  perpetratorNationality: string
  relationshipToVictim: string
  incidentLocation: string
  incidentSummary: string
  typeOfViolence: string
  injuryDescription: string
  evidenceMentioned: string
  reportedToAuthorities: string
  actionTaken: string
  recurrence: string
  caseStatus: string
  relevantLaws: string
  priorCriminalHistory: string
  documentId: string
} 