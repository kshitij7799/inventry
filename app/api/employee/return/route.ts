import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(generateErrorResponse('Not authenticated'), {
        status: 401,
      });
    }

    const body = await request.json();
    const { checkoutId, returnCondition, notes } = body;

    if (!checkoutId) {
      return NextResponse.json(generateErrorResponse('Checkout ID is required'), {
        status: 400,
      });
    }

    const db = await getDatabase();
    const checkout = await db.collection('checkouts').findOne({
      checkoutId,
      employeeId: user.employeeId,
    });

    if (!checkout) {
      return NextResponse.json(generateErrorResponse('Checkout not found'), {
        status: 404,
      });
    }

    if (checkout.status !== 'checked_out') {
      return NextResponse.json(generateErrorResponse('This checkout is not active'), {
        status: 400,
      });
    }

    const now = new Date();

    await db.collection('checkouts').updateOne(
      { checkoutId },
      {
        $set: {
          status: 'returned',
          returnDateTime: now,
          returnCondition: returnCondition || 'good',
          notes: notes || checkout.notes || '',
          updatedAt: now,
        },
      }
    );

    await db.collection('equipment').updateOne(
      { equipmentId: checkout.equipmentId },
      {
        $inc: { availableQuantity: checkout.quantityCheckout },
        $set: { updatedAt: now },
      }
    );

    return NextResponse.json(
      generateSuccessResponse('Equipment returned successfully')
    );
  } catch (error) {
    console.error('[v0] Return error:', error);
    return NextResponse.json(generateErrorResponse('Failed to process return', error), {
      status: 500,
    });
  }
}
