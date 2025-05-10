import mongoose, { Document, Schema } from 'mongoose';

// Define the AttendanceRequest interface
interface AttendanceRequest extends Document {
  student: {
    name: string;
    rollNo: string;
    class: string;
    studentId: string;
  };
  event: {
    eventName: string;
    eventLocation: string;
    eventDate: Date;
    lectureTime: string;
  };
  classInfo: {
    subject: string;
    professor: string;
    reasonForAbsence: string;
  };
  supportingDocument: string; // File URL or path (for storage, like on a cloud service)
  status: 'pending' | 'approved' | 'rejected';
}

// Create the Attendance Request schema
const attendanceRequestSchema: Schema = new Schema(
  {
    student: {
      name: { type: String, required: true },
      rollNo: { type: String, required: true },
      class: { type: String, required: true },
      studentId: { type: String, required: true },
    },
    event: {
      eventName: { type: String, required: true },
      eventLocation: { type: String, required: true },
      eventDate: { type: Date, required: true },
      lectureTime: { type: String, required: true },
    },
    classInfo: {
      subject: { type: String, required: true },
      professor: { type: String, required: true },
      reasonForAbsence: { type: String, required: true },
    },
    supportingDocument: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the model
const AttendanceRequestModel =(mongoose.models.AttendanceRequest as mongoose.Model<AttendanceRequest>) || mongoose.model<AttendanceRequest>('AttendanceRequest', attendanceRequestSchema);

export default AttendanceRequestModel;
