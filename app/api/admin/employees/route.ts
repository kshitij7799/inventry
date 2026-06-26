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

    const db = await getDatabase();
    const employees = await db
      .collection('employees')
      .find({ role: 'employee' })
      .project({
        password: 0,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      generateSuccessResponse('Employees retrieved', {
        employees,
        total: employees.length,
      })
    );
  } catch (error) {
    console.error('[v0] Get employees error:', error);
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
    const { employeeId, isActive } = body;

    if (!employeeId || typeof isActive !== 'boolean') {
      return NextResponse.json(generateErrorResponse('Invalid request'), {
        status: 400,
      });
    }

    const db = await getDatabase();

    const result = await db.collection('employees').updateOne(
      { employeeId },
      {
        $set: {
          isActive,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(generateErrorResponse('Employee not found'), {
        status: 404,
      });
    }

    return NextResponse.json(
      generateSuccessResponse(`Employee ${isActive ? 'activated' : 'deactivated'}`)
    );
  } catch (error) {
    console.error('[v0] Update employee error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
