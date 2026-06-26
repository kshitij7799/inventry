import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse, generateRegistrationCode } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(generateErrorResponse('Not authorized'), {
        status: 403,
      });
    }

    const body = await request.json();
    const expiresInDays = body.expiresInDays || 30;

    if (!expiresInDays || expiresInDays < 1) {
      return NextResponse.json(
        generateErrorResponse('Expiration days must be at least 1'),
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const code = generateRegistrationCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const codeDoc = {
      code,
      createdBy: user.employeeId,
      isUsed: false,
      expiresAt,
      createdAt: new Date(),
    };

    const result = await db.collection('registrationCodes').insertOne(codeDoc);

    return NextResponse.json(
      generateSuccessResponse('Registration code generated', {
        code,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Generate code error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
