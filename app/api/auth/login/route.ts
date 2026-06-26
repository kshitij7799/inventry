import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyPassword } from '@/lib/auth';
import { getDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, password } = body;

    if (!employeeId || !password) {
      return NextResponse.json(
        { error: 'Employee ID and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection('employees').findOne({
      employeeId,
      isActive: true,
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid employee ID or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid employee ID or password' },
        { status: 401 }
      );
    }

    const token = createToken({
      employeeId: user.employeeId,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        employeeId: user.employeeId,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

    response.cookies.set('lab-inventory-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
