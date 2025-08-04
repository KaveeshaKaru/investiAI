import connectDB from '../mongodb';
import PredictionModel from '@/models/schemas/Prediction';

export async function upsertPrediction(predictionData: {
  caseId: string,
  caseSummary: string,
  suggestedAction: string,
  policeReport: string,
}) {
  await connectDB();
  
  return await PredictionModel.findOneAndUpdate(
    { caseId: predictionData.caseId },
    predictionData,
    { upsert: true, new: true, runValidators: true }
  );
}

export async function createPrediction(predictionData: {
  caseId: string,
  caseSummary: string,
  suggestedAction: string,
  policeReport: string,
}) {
  await connectDB();
  const prediction = new PredictionModel(predictionData);
  return await prediction.save();
}

export async function getAllPredictions() {
  await connectDB();
  return await PredictionModel.find({}).sort({ createdAt: -1 });
}

export async function getPredictionByCaseId(caseId: string) {
  await connectDB();
  return await PredictionModel.findOne({ caseId });
}