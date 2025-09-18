import { NextRequest, NextResponse } from 'next/server';
import { generateVirtualTryOn, generateMockVirtualTryOn } from '@/lib/fal-client';
import { VirtualTryOnResponse } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { faceImageUrl, selectedJewelry, generate3D, sessionId } = body;

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

    const startTime = Date.now();
    let result: VirtualTryOnResponse;
    if (hasFalKey) {
      console.log('Using fal.ai API for virtual try-on...');
      console.log('Selected jewelry:', selectedJewelry.map(j => j.name).join(', '));
      result = await generateVirtualTryOn(faceImageUrl, selectedJewelry, generate3D);
    } else {
      console.log('Using mock data (no API key found)...');
      result = await generateMockVirtualTryOn(selectedJewelry, generate3D);
    }

    const processingTime = Date.now() - startTime;

    // Save result to database
    try {
      const savedTryOn = await prisma.virtualTryOn.create({
        data: {
          faceImageUrl,
          tryOnImageUrl: result.tryOnImage,
          threeDModelUrl: result.threeDModel || null,
          jewelryItems: selectedJewelry,
          modelUsed: result.model_used,
          processingTime,
          sessionId: sessionId || null
        }
      });

      // Update jewelry usage count
      for (const jewelry of selectedJewelry) {
        if (jewelry.id) {
          await prisma.jewelryCollection.updateMany({
            where: { id: jewelry.id },
            data: { usageCount: { increment: 1 } }
          });
        }
      }

      // Add database ID to response
      result.id = savedTryOn.id;
      console.log('Try-on result saved to database with ID:', savedTryOn.id);
    } catch (dbError) {
      console.error('Failed to save to database:', dbError);

      if (dbError instanceof Error && dbError.message.includes('PrismaClient')) {
        console.log('Database not initialized, but continuing with try-on result');
      }

      // Continue without failing the request - try-on still works without database
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