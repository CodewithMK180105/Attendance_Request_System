import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.models';

// GET /api/attendance-requests
export async function GET(req: Request) {
  try {
    await dbConnect();

    const college = req.headers.get('x-college');
    const department = req.headers.get('x-department');

    console.log('Fetching professors:', { college, department });

    const prof = await User.find({college, department, role: "professor" }).sort({ createdAt: 1 });

    return NextResponse.json(
      { success: true, data: prof },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Professors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Professors' },
      { status: 500 }
    );
  }
}
