import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import { generateClassCode } from "@/lib/codeGeneration";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const {
      name,
      email,
      password,
      rollNo,
      userId,
      division,
      department,
      college,
      contactNumber,
      gender,
      profilePicture,
      role,
      studentCode,
      professorCode,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check for existing email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "hod") {
      // Check for existing HOD in the same college and department
      const existingHOD = await UserModel.findOne({ college, department, role: "hod" });
      if (existingHOD) {
        return NextResponse.json(
          { success: false, message: "HOD already exists for this college and department" },
          { status: 409 }
        );
      }

      let newStudentCode = "";
      let newProfessorCode = "";
      // Generate unique codes
      do {
        newStudentCode = generateClassCode();
      } while (await UserModel.findOne({ role: "hod", studentCode: newStudentCode }));

      do {
        newProfessorCode = generateClassCode();
      } while (await UserModel.findOne({ role: "hod", professorCode: newProfessorCode }));

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        department,
        college,
        contactNumber,
        gender,
        profilePicture,
        role,
        studentCode: newStudentCode,
        professorCode: newProfessorCode,
      });

      await newUser.save();
      return NextResponse.json(
        { success: true, message: "HOD registered successfully" },
        { status: 201 }
      );
    } else if (role === "professor") {
      if (!professorCode) {
        return NextResponse.json(
          { success: false, message: "Professor code is required" },
          { status: 400 }
        );
      }

      const hod = await UserModel.findOne({ role: "hod", professorCode });
      if (!hod) {
        return NextResponse.json(
          { success: false, message: "Invalid professor code" },
          { status: 404 }
        );
      }

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        department: hod.department,
        college: hod.college,
        contactNumber,
        gender,
        profilePicture,
        role,
        professorCode,
      });

      await newUser.save();
      return NextResponse.json(
        { success: true, message: "Professor registered successfully" },
        { status: 201 }
      );
    } else if (role === "student") {
      if (!studentCode) {
        return NextResponse.json(
          { success: false, message: "Student code is required" },
          { status: 400 }
        );
      }

      if (!rollNo || !userId || !division) {
        return NextResponse.json(
          { success: false, message: "Roll number, student ID, and class are required" },
          { status: 400 }
        );
      }

      const hod = await UserModel.findOne({ role: "hod", studentCode });
      if (!hod) {
        return NextResponse.json(
          { success: false, message: "Invalid student code" },
          { status: 404 }
        );
      }

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        rollNo,
        userId,
        division,
        department: hod.department,
        college: hod.college,
        contactNumber,
        gender,
        profilePicture,
        role,
        studentCode,
      });

      await newUser.save();
      return NextResponse.json(
        { success: true, message: "Student registered successfully" },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid role" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}