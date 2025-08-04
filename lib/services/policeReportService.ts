import { PoliceReport } from '@/lib/types';
import connectDB from '../mongodb';
import PoliceReportModel from '@/models/schemas/PoliceReport';

// Helper function to normalize case status
function normalizeCaseStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'referred to court': 'referred to court',
    'ongoing': 'ongoing',
    'concluded': 'concluded',
    'active': 'ongoing',
    'pending': 'ongoing',
    'closed': 'concluded',
    'unknown': 'ongoing'
  };

  const normalizedStatus = status.toLowerCase().trim();
  return statusMap[normalizedStatus] || 'ongoing';
}

export async function upsertPoliceReport(reportData: PoliceReport) {
  await connectDB();
  
  const normalizedData = {
    ...reportData,
    caseStatus: normalizeCaseStatus(reportData.caseStatus || 'ongoing')
  };
  
  return await PoliceReportModel.findOneAndUpdate(
    { caseId: reportData.caseId },
    normalizedData,
    { upsert: true, new: true, runValidators: true }
  );
}

export async function createPoliceReport(reportData: PoliceReport) {
  await connectDB();
  
  // Normalize the case status before saving
  const normalizedData = {
    ...reportData,
    caseStatus: normalizeCaseStatus(reportData.caseStatus || 'ongoing')
  };
  
  const report = new PoliceReportModel(normalizedData);
  return await report.save();
}

export async function getAllPoliceReports() {
  await connectDB();
  return await PoliceReportModel.find({}).sort({ createdAt: -1 });
}

export async function getPoliceReportById(id: string) {
  await connectDB();
  return await PoliceReportModel.findById(id);
}

export async function getPoliceReportByCaseId(caseId: string) {
  await connectDB();
  return await PoliceReportModel.findOne({ caseId });
}

export async function updatePoliceReport(id: string, reportData: Partial<PoliceReport>) {
  await connectDB();
  
  // Normalize the case status if it's being updated
  const normalizedData: Partial<PoliceReport> = { ...reportData };
  if (reportData.caseStatus) {
    normalizedData.caseStatus = normalizeCaseStatus(reportData.caseStatus);
  }
  
  return await PoliceReportModel.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true,
  });
}

export async function deletePoliceReport(id: string) {
  await connectDB();
  return await PoliceReportModel.findByIdAndDelete(id);
}

export async function searchPoliceReports(query: string) {
  await connectDB();
  return await PoliceReportModel.find({
    $or: [
      { caseId: { $regex: query, $options: 'i' } },
      { incidentLocation: { $regex: query, $options: 'i' } },
      { typeOfViolence: { $regex: query, $options: 'i' } },
      { victimName: { $regex: query, $options: 'i' } },
      { perpetratorName: { $regex: query, $options: 'i' } },
    ],
  }).sort({ createdAt: -1 });
}

export async function getPoliceReportsByStatus(status: string) {
  await connectDB();
  const normalizedStatus = normalizeCaseStatus(status);
  return await PoliceReportModel.find({ caseStatus: normalizedStatus }).sort({ createdAt: -1 });
}