import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: [true, 'Please provide a case number'],
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a case title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a case description'],
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Under Investigation'],
    default: 'Open',
  },
  assignedTo: {
    type: String,
    required: [true, 'Please provide the assigned investigator'],
  },
  dateOpened: {
    type: Date,
    default: Date.now,
  },
  dateClosed: {
    type: Date,
  },
  documents: [{
    type: String,  // URLs or file paths to related documents
  }],
  tags: [{
    type: String,
  }],
});

export default mongoose.models.Case || mongoose.model('Case', CaseSchema);