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
  reportDate: string
  victimAge: string
  victimGender: string
  victimRelationshipToPerpetrator: string
  perpetratorAge: string
  perpetratorGender: string
  perpetratorRelationshipToVictim: string
  incidentLocation: string
  typeOfViolence: string
  severityLevel: string
  reportedToAuthorities: string
  actionTaken: string
  recurrence: string
  outcomeOfTheCase: string
  criminalStatus: string
  documentId: string
} 