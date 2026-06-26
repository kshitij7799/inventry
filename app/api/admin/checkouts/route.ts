import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(generateErrorResponse('Not authorized'), {
        status: 403,
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const db = await getDatabase();

    let query: any = {};
    if (status && ['checked_out', 'returned', 'overdue'].includes(status)) {
      query.status = status;
    }

    const checkouts = await db
      .collection('checkouts')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: 'employeeId',
            as: 'employee',
          },
        },
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

    return NextResponse.json(
      generateSuccessResponse('Checkouts retrieved', {
        checkouts,
        total: checkouts.length,
      })
    );
  } catch (error) {
    console.error('[v0] Get checkouts error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(generateErrorResponse('Not authorized'), {
        status: 403,
      });
    }

    const body = await request.json();
    const { checkoutId, status } = body;

    if (!checkoutId || !['checked_out', 'returned', 'overdue'].includes(status)) {
      return NextResponse.json(generateErrorResponse('Invalid request'), {
        status: 400,
      });
    }

    const db = await getDatabase();

    const result = await db.collection('checkouts').updateOne(
      { checkoutId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(generateErrorResponse('Checkout not found'), {
        status: 404,
      });
    }

    return NextResponse.json(generateSuccessResponse('Checkout status updated'));
  } catch (error) {
    console.error('[v0] Update checkout error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
