import { NextResponse } from 'next/server';
import {
  getPoliceReportById,
  updatePoliceReport,
  deletePoliceReport,
} from '@/lib/services/policeReportService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await getPoliceReportById(params.id);
    if (!report) {
      return NextResponse.json(
        { error: 'Police report not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch police report' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const report = await updatePoliceReport(params.id, body);
    if (!report) {
      return NextResponse.json(
        { error: 'Police report not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update police report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await deletePoliceReport(params.id);
    if (!report) {
      return NextResponse.json(
        { error: 'Police report not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Police report deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete police report' },
      { status: 500 }
    );
  }
}