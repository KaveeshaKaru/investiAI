import { NextResponse } from 'next/server';
import { getAllPredictions } from '@/lib/services/predictionService';

export async function GET() {
  try {
    const predictions = await getAllPredictions();
    return NextResponse.json(predictions);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}