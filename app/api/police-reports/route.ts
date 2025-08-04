import { NextResponse } from 'next/server';
import {
  createPoliceReport,
  getAllPoliceReports,
  searchPoliceReports,
  getPoliceReportsByStatus,
} from '@/lib/services/policeReportService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const report = await createPoliceReport(body);
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create police report' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const status = searchParams.get('status');

    let reports;
    if (query) {
      reports = await searchPoliceReports(query);
    } else if (status) {
      reports = await getPoliceReportsByStatus(status);
    } else {
      reports = await getAllPoliceReports();
    }

    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch police reports' },
      { status: 500 }
    );
  }
}