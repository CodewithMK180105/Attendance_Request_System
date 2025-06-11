import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AttendanceRequestModel from '@/models/request.models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: 'Request ID is required' },
        { status: 400 }
      );
    }

    const request = await AttendanceRequestModel.findByIdAndDelete(requestId);

    if (!request) {
      return NextResponse.json(
        { success: false, message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Attendance granted successfully please reload the page to see the changes' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting attendance request:', error);
    return NextResponse.json(
      { success: false, message: `Failed to grant attendence` },
      { status: 500 }
    );
  }
}