import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({
      success: false,
      message: "Email is required",
    }, { status: 400 });
  }

  await dbConnect(); // Ensure DB is connected

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      verifyCode: user.verifyCode,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
