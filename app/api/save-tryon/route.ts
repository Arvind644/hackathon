import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      faceImageUrl,
      tryOnImageUrl,
      threeDModelUrl,
      jewelryItems,
      modelUsed,
      processingTime,
      sessionId
    } = body;

    if (!faceImageUrl || !tryOnImageUrl || !jewelryItems || !modelUsed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedTryOn = await prisma.virtualTryOn.create({
      data: {
        faceImageUrl,
        tryOnImageUrl,
        threeDModelUrl,
        jewelryItems,
        modelUsed,
        processingTime: processingTime || 0,
        sessionId
      }
    });

    // Update jewelry usage count
    if (Array.isArray(jewelryItems)) {
      for (const jewelry of jewelryItems) {
        if (jewelry.id) {
          await prisma.jewelryCollection.updateMany({
            where: { id: jewelry.id },
            data: { usageCount: { increment: 1 } }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      id: savedTryOn.id,
      data: savedTryOn
    });
  } catch (error) {
    console.error('Save try-on error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save try-on result' },
      { status: 500 }
    );
  }
}