import dbConnect from "@/lib/dbConnect";
import AttendanceRequestModel from "@/models/request.models";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "****" : undefined, // Hide sensitive data
  api_secret: process.env.CLOUDINARY_API_SECRET ? "****" : undefined,
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // Parse the form data
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const rollNo = formData.get("rollNo")?.toString();
    const division = formData.get("division")?.toString();
    const studentId = formData.get("studentId")?.toString();
    const eventName = formData.get("eventName")?.toString();
    const eventLocation = formData.get("eventLocation")?.toString();
    const eventDate = formData.get("eventDate")?.toString();
    const lectureTime = formData.get("lectureTime")?.toString();
    const subject = formData.get("subject")?.toString();
    const professor = formData.get("professor")?.toString();
    const reasonForAbsence = formData.get("reasonForAbsence")?.toString();
    const supportingDocument = formData.get("supportingDocument") as File | null;

    // Check for missing required fields
    const requiredFields = {
      name,
      rollNo,
      division,
      studentId,
      eventName,
      eventLocation,
      eventDate,
      lectureTime,
      subject,
      professor,
      reasonForAbsence,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === "") {
        return NextResponse.json(
          { success: false, message: `${key} is required` },
          { status: 400 }
        );
      }
    }

    // Convert eventDate and lectureTime to Date object
    const eventDateTime = new Date(`${eventDate!}T${lectureTime!}`);
    const now = new Date();

    if (eventDateTime < now) {
      return NextResponse.json(
        {
          success: false,
          message: "Event date and lecture time must be in the future",
        },
        { status: 400 }
      );
    }

    // Upload supporting document to Cloudinary if provided
    let documentUrl = "";
    if (supportingDocument) {
      const buffer = Buffer.from(await supportingDocument.arrayBuffer());
      const stream = Readable.from(buffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "attendance_requests" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });

      documentUrl = (uploadResult as any).secure_url;
    }

    // Save the request to the database
    const request = new AttendanceRequestModel({
      student: {
        name,
        rollNo,
        class: division,
        studentId,
      },
      event: {
        eventName,
        eventLocation,
        eventDate: new Date(eventDate!),
        lectureTime,
      },
      classInfo: {
        subject,
        professor,
        reasonForAbsence,
      },
      supportingDocument: documentUrl,
      status: "pending",
    });

    await request.save();

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Request form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}