import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AttendanceRequestModel from '@/models/request.models';

// GET /api/attendance-requests
export async function GET(req: Request) {
  try {
    await dbConnect();

    const college = req.headers.get('x-college');
    const department = req.headers.get('x-department');
    const email = req.headers.get('x-email');

    console.log('Fetching attendance requests for:', { college, department, email });

    const requests = await AttendanceRequestModel.find({college, department, "classInfo.professor": email}).sort({ createdAt: 1 });

    return NextResponse.json(
      { success: true, data: requests },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching attendance requests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
