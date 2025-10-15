import { NextRequest, NextResponse } from 'next/server';
import { cleanImage } from '@/lib/fal-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { faceImageUrl } = body;

    if (!faceImageUrl) {
      return NextResponse.json(
        { error: 'Missing faceImageUrl' },
        { status: 400 }
      );
    }

    // Check if we have a fal.ai API key
    const hasFalKey = !!process.env.NEXT_PUBLIC_FAL_KEY;

    if (!hasFalKey) {
      return NextResponse.json(
        { error: 'FAL API key not configured' },
        { status: 500 }
      );
    }

    console.log('Cleaning image via API...');
    console.log('Image URL:', faceImageUrl);

    const cleanedImageUrl = await cleanImage(faceImageUrl);

    return NextResponse.json({
      success: true,
      cleanedImageUrl,
      originalImageUrl: faceImageUrl
    });

  } catch (error) {
    console.error('Image cleaning API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Image cleaning failed: ${message}` },
      { status: 500 }
    );
  }
}
