import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { generateEmailTemplate } from '@/helper/emailTemplate';

interface EmailRequestBody {
  name: string;
  email: string;
  role: string;
  verificationCode: string;
}

export async function POST(req: Request) {
  try {
    const body: EmailRequestBody = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: body.email,
      subject: "Verification Code For Attendance Request System.",
      html: generateEmailTemplate(body.verificationCode, body.role, body.name),
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, info });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
