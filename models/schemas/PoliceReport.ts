import mongoose, { Schema } from 'mongoose';

const PoliceReportSchema = new Schema({
  caseId: {
    type: String,
    required: [true, 'Please provide a case ID'],
    unique: true,
  },
  incidentDate: {
    type: String,
    required: [true, 'Please provide an incident date'],
  },
  incidentTime: {
    type: String,
    required: [true, 'Please provide an incident time'],
  },
  reportDate: {
    type: String,
    required: [true, 'Please provide a report date'],
  },
  victimName: {
    type: String,
    required: [true, 'Please provide victim name'],
  },
  victimAge: {
    type: String,
    required: [true, 'Please provide victim age'],
  },
  victimGender: {
    type: String,
    required: [true, 'Please provide victim gender'],
  },
  victimNationality: {
    type: String,
  },
  perpetratorName: {
    type: String,
    required: [true, 'Please provide perpetrator name'],
  },
  perpetratorGender: {
    type: String,
  },
  perpetratorNationality: {
    type: String,
  },
  relationshipToVictim: {
    type: String,
  },
  incidentLocation: {
    type: String,
    required: [true, 'Please provide incident location'],
  },
  incidentSummary: {
    type: String,
    required: [true, 'Please provide incident summary'],
  },
  typeOfViolence: {
    type: String,
  },
  injuryDescription: {
    type: String,
  },
  evidenceMentioned: {
    type: String,
  },
  reportedToAuthorities: {
    type: String,
  },
  actionTaken: {
    type: String,
  },
  recurrence: {
    type: String,
  },
  caseStatus: {
    type: String,
    enum: ['ongoing', 'referred to court', 'concluded'],
    default: 'ongoing',
  },
  relevantLaws: {
    type: String,
  },
  priorCriminalHistory: {
    type: String,
  },
  documentId: {
    type: String,
    required: [true, 'Please provide document ID'],
  },
}, {
  timestamps: true,
});

const PoliceReport = mongoose.models.PoliceReport || mongoose.model('PoliceReport', PoliceReportSchema);
export default PoliceReport;