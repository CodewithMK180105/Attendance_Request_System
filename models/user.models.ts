import mongoose, { Document, Schema } from 'mongoose';

// Define the possible roles a user can have
type UserRole = "hod" | "student" | "professor";

// Define the User interface
interface User extends Document {
  name: string;
  email: string;
  password: string;
  rollNo?: string;              // For students
  userId?: string;              // For students
  division?: string;               // For students
  department: string;
  college: string;
  contactNumber: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  profilePicture?: string;
  role: "hod" | "student" | "professor";
  studentCode?: string;         // For students
  professorCode?: string;       // For professors
  createdAt?: Date;             // Automatically added by timestamps
  updatedAt?: Date;             // Automatically added by timestamps
}


// Create the user schema
const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, match:[/.+\@.+\..+/, "Please enter a valid email address"], unique: true },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    rollNo: { type: String },  // Only for students
    userId: { type: String },  // Only for students
    division: { type: String },  // Only for students
    department: { type: String, required: true },
    college: { type: String, required: true },
    contactNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "Prefer not to say" },
    profilePicture: { type: String, default: "" },
    role: { type: String, required: true, enum: ["hod", "student", "professor"] },
    studentCode: { type: String },
    professorCode: { type: String },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default UserModel;
