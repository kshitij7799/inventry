import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateCheckoutId, generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(generateErrorResponse('Not authenticated'), {
        status: 401,
      });
    }

    const body = await request.json();
    const { equipmentId, quantityCheckout, notes } = body;

    if (!equipmentId || !quantityCheckout || quantityCheckout < 1) {
      return NextResponse.json(
        generateErrorResponse('Equipment ID and quantity are required'),
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const equipment = await db.collection('equipment').findOne({ equipmentId });

    if (!equipment) {
      return NextResponse.json(generateErrorResponse('Equipment not found'), {
        status: 404,
      });
    }

    if (equipment.availableQuantity < quantityCheckout) {
      return NextResponse.json(generateErrorResponse('Insufficient quantity available'), {
        status: 400,
      });
    }

    const checkoutId = generateCheckoutId();
    const now = new Date();

    const checkoutRecord = {
      checkoutId,
      employeeId: user.employeeId,
      equipmentId,
      quantityCheckout,
      notes: notes || '',
      status: 'checked_out',
      checkoutDateTime: now,
      returnDateTime: null,
      returnCondition: null,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('checkouts').insertOne(checkoutRecord);
    await db.collection('equipment').updateOne(
      { equipmentId },
      {
        $inc: { availableQuantity: -quantityCheckout },
        $set: { updatedAt: now },
      }
    );

    return NextResponse.json(
      generateSuccessResponse('Equipment checkout requested successfully', {
        checkoutId,
        equipment: equipment.name,
        quantity: quantityCheckout,
      })
    );
  } catch (error) {
    console.error('[v0] Checkout error:', error);
    return NextResponse.json(generateErrorResponse('Failed to process checkout', error), {
      status: 500,
    });
  }
}
