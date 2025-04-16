import mongoose, { Document, Schema } from 'mongoose';

// Define the possible roles a user can have
type UserRole = "hod" | "student" | "professor";

// Define the User interface
interface User extends Document {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  profilePicture?: string;
  role: UserRole;
  department: string;
  college: string;
  specialization?: string;  // For professors
  rollNo?: string;  // For students
  studentId?: string;  // For students
  class?: string;  // For students
}

// Create the user schema
const userSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "Prefer not to say" },
    profilePicture: { type: String, default: "" },
    role: { type: String, required: true, enum: ["hod", "student", "professor"] },
    department: { type: String, required: true },
    college: { type: String, required: true },
    specialization: { type: String },  // Only for professors
    rollNo: { type: String },  // Only for students
    studentId: { type: String },  // Only for students
    class: { type: String },  // Only for students
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
