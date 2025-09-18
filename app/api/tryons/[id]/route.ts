import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tryOn = await prisma.virtualTryOn.findUnique({
      where: { id }
    });

    if (!tryOn) {
      return NextResponse.json(
        { error: 'Try-on result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tryOn
    });
  } catch (error) {
    console.error('Get try-on by ID error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch try-on result' },
      { status: 500 }
    );
  }
}