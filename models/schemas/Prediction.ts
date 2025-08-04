import mongoose, { Schema } from 'mongoose';

const PredictionSchema = new Schema({
  caseId: {
    type: String,
    required: [true, 'Please provide a case ID'],
    unique: true,
  },
  caseSummary: {
    type: String,
    required: [true, 'Please provide a case summary'],
  },
  suggestedAction: {
    type: String,
    required: [true, 'Please provide a suggested action'],
  },
  policeReport: {
    type: Schema.Types.ObjectId,
    ref: 'PoliceReport',
    required: true,
  },
}, {
  timestamps: true,
});

const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
export default Prediction;