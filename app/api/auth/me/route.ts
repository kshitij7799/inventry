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

    return NextResponse.json(
      generateSuccessResponse('User retrieved', {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        phoneNumber: employee.phoneNumber,
      })
    );
  } catch (error) {
    console.error('[v0] Get user error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
