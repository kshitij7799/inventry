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
    const checkouts = await db
      .collection('checkouts')
      .aggregate([
        { $match: { employeeId: user.employeeId } },
        {
          $lookup: {
            from: 'equipment',
            localField: 'equipmentId',
            foreignField: 'equipmentId',
            as: 'equipment',
          },
        },
        { $sort: { checkoutDateTime: -1 } },
      ])
      .toArray();

    return NextResponse.json(
      generateSuccessResponse('Checkouts retrieved', {
        checkouts,
        total: checkouts.length,
      })
    );
  } catch (error) {
    console.error('[v0] Error fetching checkouts:', error);
    return NextResponse.json(generateErrorResponse('Failed to fetch checkouts', error), {
      status: 500,
    });
  }
}
