export const generateEmailTemplate = (
  verificationCode: string,
  role: string,
  name: string
) => {
  const verificationMessage = `
    <p style="font-size: 20px; color: #ff4500; font-weight: bold;">
      Your verification code is: <span style="font-size: 24px; color: #2d6cdf; font-weight: bold;">${verificationCode}</span>
    </p>
  `;

  const message = `
    <p>Hello ${name},</p>
    <p>To Register as a ${role}, please use the following verification code:</p>
    ${verificationMessage}
    <p>If you did not request this, please ignore this email.</p>
    <p>Best Regards,</p>
    <p>Your Attendance System Team</p>
  `;

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            color: #333;
          }
          h2 {
            color: #4CAF50;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>Attendance Request Verification</h2>
          ${message}
          <div class="footer">
            <p>If you have any questions, feel free to contact us at <strong>manishkumar180105@gmail.com</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
};
