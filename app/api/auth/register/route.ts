import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse, generateEmployeeId } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(generateErrorResponse('Validation failed', validation.error), {
        status: 400,
      });
    }

    const { employeeId, name, email, password, registrationCode, department, phoneNumber } =
      validation.data;
    const db = await getDatabase();

    // Check if registration code exists and is valid
    const codeDoc = await db.collection('registrationCodes').findOne({
      code: registrationCode,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!codeDoc) {
      return NextResponse.json(
        generateErrorResponse('Invalid or expired registration code'),
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const existingEmployee = await db.collection('employees').findOne({
      employeeId,
    });

    if (existingEmployee) {
      return NextResponse.json(generateErrorResponse('Employee ID already exists'), {
        status: 400,
      });
    }

    // Check if email already exists
    const existingEmail = await db.collection('employees').findOne({
      email,
    });

    if (existingEmail) {
      return NextResponse.json(generateErrorResponse('Email already registered'), {
        status: 400,
      });
    }

    const hashedPassword = await hashPassword(password);

    // Create employee
    const employeeResult = await db.collection('employees').insertOne({
      employeeId,
      name,
      email,
      password: hashedPassword,
      registrationCode,
      role: 'employee',
      department,
      phoneNumber,
      createdAt: new Date(),
      isActive: true,
    });

    // Mark registration code as used
    await db.collection('registrationCodes').updateOne(
      { _id: codeDoc._id },
      {
        $set: {
          isUsed: true,
          usedBy: employeeResult.insertedId,
        },
      }
    );

    const token = createToken({
      employeeId,
      role: 'employee',
      email,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      generateSuccessResponse('Registration successful', {
        employeeId,
        name,
        role: 'employee',
        email,
      })
    );
  } catch (error) {
    console.error('[v0] Register error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
