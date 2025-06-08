import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { code } = await request.json();

    // Basic validation for code
    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
      return Response.json({
        success: false,
        message: "Please provide a valid 6-digit code",
      }, { status: 400 });
    }

    // Assuming user is identified via some other mechanism (e.g., session or token)
    // For this example, we'll find a user with the matching verification code
    const user = await UserModel.findOne({ verifyCode: code });

    if (!user) {
      console.log("No user found with provided verification code");
      return Response.json({
        success: false,
        message: "Invalid verification code",
      }, { status: 400 });
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json({
        success: true,
        message: "Account verified successfully",
      }, { status: 200 });
    } else {
      return Response.json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json({
      success: false,
      message: "An error occurred while verifying the code",
    }, { status: 500 });
  }
}