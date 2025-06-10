import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AttendanceRequestModel from '@/models/request.models';

// GET /api/attendance-requests
export async function GET(req: Request) {
  try {
    await dbConnect();

    const userId = req.headers.get('x-userId');

    console.log('Fetching attendance requests for backend: ', { userId });

    const requests = await AttendanceRequestModel.find({ "student.studentId" :userId }).sort({ createdAt: 1 });

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
