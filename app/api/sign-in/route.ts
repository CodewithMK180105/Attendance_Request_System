// app/api/sign-in/route.ts
import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/models/user.models';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email, password, role } = body;

    console.log('API: Login attempt:', { email, role });

    // Basic validation
    if (!email || !password || !role) {
      console.log('API: Validation failed: Missing fields');
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const validRoles = ['student', 'hod', 'professor'];
    if (!validRoles.includes(role)) {
      console.log('API: Validation failed: Invalid role:', role);
      return NextResponse.json(
        { success: false, message: 'Invalid role selected' },
        { status: 401 }
      );
    }

    // Check user
    const user: IUser | null = await UserModel.findOne({ email });
    if (!user) {
      console.log('API: No user found for email:', email);
      return NextResponse.json(
        { success: false, message: 'No user found with this email' },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      console.log('API: Role mismatch: Expected', role, 'but user has', user.role);
      return NextResponse.json(
        {
          success: false,
          message: `User with this email is present as a role of ${user.role}`,
        },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('API: Invalid password for email:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = await generateToken({
      email: user.email,
      role: user.role,
    });

    console.log('API: Token generated for user:', { email, role });

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('API: Cookie set: auth_token, Secure:', process.env.NODE_ENV === 'production', 'NODE_ENV:', process.env.NODE_ENV);
    return res;
  } catch (error) {
    console.error('API: Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}