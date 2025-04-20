// lib/auth.ts
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import UserModel from "@/models/user.models";
import dbConnect from "./dbConnect";

export async function getUserFromCookies() {
  // Ensure MongoDB connection
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.log("getUserFromCookies: No token found");
    return null;
  }

  // Await token verification to get the user data
  let user;
  try {
    user = await verifyToken(token); // Await the promise to get the resolved user data
  } catch (error) {
    console.error("getUserFromCookies: Token verification failed", error);
    return null;
  }

  if (!user) {
    console.log("getUserFromCookies: No user found after token verification");
    return null;
  }

  // Log the user data (this should be just the basic token data)
  // console.log("User verified:", user);

  // Fetch complete user details from the database using user.id
  const userDetail = await UserModel.findById(user.id).select("-password");;
  if (!userDetail) {
    console.log("getUserFromCookies: User not found in the database");
    return null;
  }

  // Log the complete user details to verify data fetched from the database
  // console.log("Complete User Details:", userDetail);

  return userDetail; // Return complete user details with all fields
}