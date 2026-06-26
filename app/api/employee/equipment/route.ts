import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(generateErrorResponse('Not authenticated'), {
        status: 401,
      });
    }

    const db = await getDatabase();
    const equipment = await db
      .collection('equipment')
      .find({ availableQuantity: { $gt: 0 } })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(
      generateSuccessResponse('Available equipment retrieved', {
        equipment,
        total: equipment.length,
      })
    );
  } catch (error) {
    console.error('[v0] Error fetching equipment:', error);
    return NextResponse.json(generateErrorResponse('Failed to fetch equipment', error), {
      status: 500,
    });
  }
}
