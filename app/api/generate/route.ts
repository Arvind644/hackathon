import { NextRequest, NextResponse } from 'next/server';
import { generateVirtualTryOn, generateMockVirtualTryOn } from '../../../lib/fal-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { faceImageUrl, selectedJewelry, generate3D } = body;

    if (!faceImageUrl || !selectedJewelry || !Array.isArray(selectedJewelry)) {
      return NextResponse.json(
        { error: 'Missing faceImageUrl or selectedJewelry array' },
        { status: 400 }
      );
    }

    if (selectedJewelry.length === 0) {
      return NextResponse.json(
        { error: 'At least one jewelry item must be selected' },
        { status: 400 }
      );
    }

    // Check if we have a fal.ai API key
    const hasFalKey = !!process.env.NEXT_PUBLIC_FAL_KEY;

    let result;
    if (hasFalKey) {
      console.log('Using fal.ai API for virtual try-on...');
      console.log('Selected jewelry:', selectedJewelry.map(j => j.name).join(', '));
      result = await generateVirtualTryOn(faceImageUrl, selectedJewelry, generate3D);
    } else {
      console.log('Using mock data (no API key found)...');
      result = await generateMockVirtualTryOn(selectedJewelry, generate3D);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Virtual try-on API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Virtual try-on failed' },
      { status: 500 }
    );
  }
}