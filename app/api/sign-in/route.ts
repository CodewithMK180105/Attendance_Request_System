import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.models';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {

  await dbConnect();

  try {
    const body = await req.json();
    const { email, password, role } = body;
  
    // Mock role options
    const validRoles = ['student', 'hod', 'professor'];
  
    // Basic validation
    if (!email || !password || !role) {
      return NextResponse.json({
          success: false,
          message: "All fileds are required"
      }, { status: 400 });
    }
  
    if (!validRoles.includes(role)) {
      return NextResponse.json({
          success: false,
          message: "Invalid role selected"
      }, { status: 401 });
    }
  
    // Mock user check (you can add dummy credentials if needed)
    const user=await UserModel.findOne({email});
  
    if(!user){
      return NextResponse.json({
          success: false,
          message: "No user found with this email"
      }, { status: 401 });
    }
  
    if(user.role!==role){
      return NextResponse.json({
          success: false,
          message: `User with this email is present as a role of ${user.role}`
      }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({
        success: false,
        message: "Invalid password",
      }, { status: 401 });
    }

    // You can now return the user data or a JWT token if needed
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
      },
    });     

  } catch (error) {
    return NextResponse.json({
          success: false,
          message: "Internal Server Error"
      }, { status: 500 });
  }
}
