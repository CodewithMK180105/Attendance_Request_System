import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AttendanceRequestModel from "@/models/request.models";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const { requestId, status } = await req.json();

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid request ID or status" },
        { status: 400 }
      );
    }

    const updatedRequest = await AttendanceRequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Request ${status}`, data: updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating request status:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
