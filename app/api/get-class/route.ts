// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/user.models";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const code = searchParams.get("code");
//     const role = searchParams.get("role");

//     if (!code) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Code is required to join a class",
//         },
//         { status: 400 }
//       );
//     }

//     if (!role) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Role is required to join a class",
//         },
//         { status: 400 }
//       );
//     }

//     if (role === "professor") {
//       const c = await UserModel.findOne({
//         role: "hod",
//         professorCode: code,
//       });
//       return NextResponse.json(
//         {
//           success: true,
//           data: {
//             department: c?.department,
//             college: c?.college,
//           },
//         },
//         { status: 200 }
//       );
//     }

//     if (role === "student") {
//       const c = await UserModel.findOne({
//         role: "hod",
//         studentCode: code,
//       });
//       return NextResponse.json(
//         {
//           success: true,
//           data: {
//             department: c?.department,
//             college: c?.college,
//           },
//         },
//         { status: 200 }
//       );
//     }

//     // Optional: handle invalid role
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Invalid role provided",
//       },
//       { status: 400 }
//     );
//   } catch (error) {
//     console.log("Get class error: ", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const role = searchParams.get("role");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Code is required" },
        { status: 400 }
      );
    }

    if (!role || !["student", "professor"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Valid role (student or professor) is required" },
        { status: 400 }
      );
    }

    const query = role === "professor" ? { professorCode: code } : { studentCode: code };
    const hod = await UserModel.findOne({ role: "hod", ...query });

    if (!hod) {
      return NextResponse.json(
        { success: false, message: `Invalid ${role} code` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          department: hod.department,
          college: hod.college,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get class error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}