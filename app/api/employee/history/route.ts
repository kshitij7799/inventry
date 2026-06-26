import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(generateErrorResponse('Not authenticated'), {
        status: 401,
      });
    }

    const db = await getDatabase();

    const employee = await db.collection('employees').findOne({
      employeeId: user.employeeId,
    });

    if (!employee) {
      return NextResponse.json(generateErrorResponse('Employee not found'), {
        status: 404,
      });
    }

    const history = await db
      .collection('checkouts')
      .aggregate([
        { $match: { employeeId: employee.employeeId } },
        {
          $lookup: {
            from: 'equipment',
            localField: 'equipmentId',
            foreignField: 'equipmentId',
            as: 'equipment',
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    const stats = {
      totalCheckouts: history.length,
      currentlyCheckedOut: history.filter((h) => h.status === 'checked_out').length,
      totalReturned: history.filter((h) => h.status === 'returned').length,
      overdue: history.filter((h) => h.status === 'overdue').length,
    };

    return NextResponse.json(
      generateSuccessResponse('Checkout history retrieved', {
        history,
        stats,
      })
    );
  } catch (error) {
    console.error('[v0] Get history error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
