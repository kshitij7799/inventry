import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse, generateEquipmentId } from '@/lib/helpers';

export async function GET() {
  try {
    const db = await getDatabase();
    const equipment = await db
      .collection('equipment')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      generateSuccessResponse('Equipment retrieved', {
        equipment,
        total: equipment.length,
      })
    );
  } catch (error) {
    console.error('[v0] Get equipment error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(generateErrorResponse('Not authorized'), {
        status: 403,
      });
    }

    const body = await request.json();
    const { equipmentId, name, description, totalQuantity, category, location, condition } = body;

    if (!name || !description || !category || !location || !condition || !totalQuantity) {
      return NextResponse.json(generateErrorResponse('All equipment fields are required'), {
        status: 400,
      });
    }

    const db = await getDatabase();

    const id = equipmentId?.trim() || generateEquipmentId();
    const existing = await db.collection('equipment').findOne({ equipmentId: id });

    if (existing) {
      return NextResponse.json(generateErrorResponse('Equipment with this ID already exists'), {
        status: 400,
      });
    }

    const now = new Date();
    const equipmentItem = {
      equipmentId: id,
      name,
      description,
      totalQuantity,
      availableQuantity: totalQuantity,
      category,
      location,
      condition,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('equipment').insertOne(equipmentItem);

    return NextResponse.json(
      generateSuccessResponse('Equipment added successfully', {
        equipment: equipmentItem,
      })
    );
  } catch (error) {
    console.error('[v0] Add equipment error:', error);
    return NextResponse.json(generateErrorResponse('Internal server error', error), {
      status: 500,
    });
  }
}
