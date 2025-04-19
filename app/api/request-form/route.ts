import dbConnect from "@/lib/dbConnect";
import AttendanceRequestModel from "@/models/request.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const {
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
            supportingDocument
        } = await req.json();

        // Check for missing required fields (excluding supportingDocument)
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
            reasonForAbsence
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === "") {
                return NextResponse.json({
                    success: false,
                    message: `${key} is required`
                }, { status: 400 });
            }
        }

        // Convert eventDate and lectureTime to Date object
        const eventDateTime = new Date(`${eventDate}T${lectureTime}`);
        const now = new Date();

        if (eventDateTime < now) {
            return NextResponse.json({
                success: false,
                message: "Event date and lecture time must be in the future"
            }, { status: 400 });
        }

        // Save the request to the database
        const request = new AttendanceRequestModel({
            student: {
                name,
                rollNo,
                class: division,
                studentId
            },
            event: {
                eventName,
                eventLocation,
                eventDate: new Date(eventDate), // Only the date part
                lectureTime
            },
            classInfo: {
                subject,
                professor,
                reasonForAbsence
            },
            supportingDocument: supportingDocument || ""
        });

        await request.save();

        return NextResponse.json({
            success: true,
            message: "Form submitted successfully"
        }, { status: 201 });

    } catch (error) {
        console.error("Request form submission error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
