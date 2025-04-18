// models/user.models.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the possible roles
type UserRole = 'hod' | 'student' | 'professor';

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  rollNo?: string;
  userId?: string;
  division?: string;
  department: string;
  college: string;
  contactNumber: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  profilePicture?: string;
  role: UserRole;
  studentCode?: string;
  professorCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the user schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
    },
    rollNo: { type: String },
    userId: { type: String },
    division: { type: String },
    department: { type: String, required: true },
    college: { type: String, required: true },
    contactNumber: { type: String, required: true },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    profilePicture: { type: String, default: '' },
    role: {
      type: String,
      required: true,
      enum: ['hod', 'student', 'professor'],
    },
    studentCode: { type: String },
    professorCode: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;