import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = sessionId ? { sessionId } : {};

    const tryOns = await prisma.virtualTryOn.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.virtualTryOn.count({ where });

    return NextResponse.json({
      success: true,
      data: tryOns,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Get try-ons error:', error);

    // Check if it's a Prisma connection error
    if (error instanceof Error && error.message.includes('PrismaClient')) {
      return NextResponse.json(
        {
          error: 'Database not initialized. Please run: npx prisma generate && npx prisma db push',
          details: error.message
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch try-on results' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing try-on ID' },
        { status: 400 }
      );
    }

    await prisma.virtualTryOn.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Try-on result deleted successfully'
    });
  } catch (error) {
    console.error('Delete try-on error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete try-on result' },
      { status: 500 }
    );
  }
}