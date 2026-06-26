import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { generateErrorResponse, generateSuccessResponse } from '@/lib/helpers';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(generateErrorResponse('Not authorized'), {
        status: 403,
      });
    }

    const db = await getDatabase();
    const totalEquipment = await db.collection('equipment').countDocuments();
    const availableEquipmentResult = await db
      .collection('equipment')
      .aggregate([
        { $group: { _id: null, available: { $sum: '$availableQuantity' } } },
      ])
      .toArray();

    const availableEquipment = availableEquipmentResult[0]?.available ?? 0;
    const totalCheckouts = await db.collection('checkouts').countDocuments();
    const equipmentInUse = await db.collection('checkouts').countDocuments({ status: 'checked_out' });
    const totalEmployees = await db.collection('employees').countDocuments({ role: 'employee' });

    return NextResponse.json(
      generateSuccessResponse('Stats retrieved', {
        totalEquipment,
        availableEquipment,
        totalCheckouts,
        activeCheckouts: equipmentInUse,
        totalEmployees,
      })
    );
  } catch (error) {
    console.error('[v0] Error fetching stats:', error);
    return NextResponse.json(generateErrorResponse('Failed to fetch stats', error), {
      status: 500,
    });
  }
}
