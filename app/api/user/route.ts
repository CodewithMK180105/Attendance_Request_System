// // app/api/user/route.ts
// import { NextResponse } from "next/server";
// import { getUserFromCookies } from "@/lib/auth";
// import UserModel from "@/models/user.models";
// import { writeFile } from "fs/promises";
// import path from "path";
// import dbConnect from "@/lib/dbConnect";

// export async function GET() {
//   try {
//     await dbConnect(); // Ensure connection
//     const user = await getUserFromCookies();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ user }, { status: 200 });
//   } catch (error) {
//     console.error("API: Failed to fetch user details:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     await dbConnect(); // Ensure connection
//     const user = await getUserFromCookies();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await request.formData();
//     const name = formData.get("name") as string;
//     const contactNumber = formData.get("contactNumber") as string;
//     const gender = formData.get("gender") as string;
//     const department = formData.get("department") as string;
//     const className = formData.get("class") as string;
//     const profilePictureFile = formData.get("profilePicture") as File | null;

//     let profilePicture = user.profilePicture;
//     if (profilePictureFile) {
//       const buffer = Buffer.from(await profilePictureFile.arrayBuffer());
//       const filename = `${user.id}-${Date.now()}-${profilePictureFile.name}`;
//       const filePath = path.join(process.cwd(), "public", "uploads", filename);
//       await writeFile(filePath, buffer);
//       profilePicture = `/uploads/${filename}`;
//     }

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       user.id,
//       {
//         name,
//         contactNumber,
//         gender,
//         department,
//         class: className,
//         profilePicture,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user: updatedUser }, { status: 200 });
//   } catch (error) {
//     console.error("API: Failed to update user:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import UserModel from "@/models/user.models";
import { writeFile } from "fs/promises";
import path from "path";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("API: Failed to fetch user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const gender = formData.get("gender") as string;
    const department = formData.get("department") as string;
    const college = formData.get("college") as string;
    const rollNo = formData.get("rollNo") as string;
    const userId = formData.get("userId") as string;
    const division = formData.get("division") as string;
    const studentCode = formData.get("studentCode") as string;
    const professorCode = formData.get("professorCode") as string;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    let profilePicture = user.profilePicture;
    if (profilePictureFile) {
      const buffer = Buffer.from(await profilePictureFile.arrayBuffer());
      const filename = `${user.id}-${Date.now()}-${profilePictureFile.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filePath, buffer);
      profilePicture = `/uploads/${filename}`;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name,
        contactNumber,
        gender,
        department,
        college,
        rollNo,
        userId,
        division,
        studentCode,
        professorCode,
        profilePicture,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("API: Failed to update user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}