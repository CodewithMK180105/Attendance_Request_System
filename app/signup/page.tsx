"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<"student" | "professor" | "hod">("student");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  const isHOD = role === "hod";
  const isCodeRequired = !isHOD;

  // Validate invitation code dynamically
  useEffect(() => {
    if (!isCodeRequired || !code.trim()) {
      setDepartment("");
      setCollege("");
      setIsCodeValid(null);
      return;
    }

    const validateCode = async () => {
      try {
        const response = await axios.get(`/api/get-class`, {
          params: { code, role },
        });
        const data = response.data;
        if (data.success) {
          setDepartment(data.data.department || "");
          setCollege(data.data.college || "");
          setIsCodeValid(true);
        } else {
          setDepartment("");
          setCollege("");
          setIsCodeValid(false);
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (error) {
        setDepartment("");
        setCollege("");
        setIsCodeValid(false);
        toast({ title: "Error", description: "Failed to validate code, Make sure to select Proper Role", variant: "destructive" });
      }
    };

    const debounce = setTimeout(validateCode, 500);
    return () => clearTimeout(debounce);
  }, [code, role, isCodeRequired, toast]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Your Password and Confirm Password do not match",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const payload: Record<string, any> = {
      name: formData.get("name"),
      email: formData.get("email"),
      password,
      role,
      department,
      college,
      contactNumber: formData.get("contactNumber"),
      gender: formData.get("gender") || undefined,
    };

    if (role === "student") {
      payload.rollNo = formData.get("rollNo");
      payload.userId = formData.get("studentId");
      payload.division = formData.get("class");
      payload.studentCode = code;
    } else if (role === "professor") {
      payload.professorCode = code;
    }

    if (profilePicture) {
      payload.profilePicture = profilePicture.name; // Placeholder
    }

    try {
      // 1. Send sign-up data
      const response = await axios.post("/api/sign-up", payload);
      const data = response.data;
      if (data.success) {
        toast({ title: "Success", description: data.message });

        // 2. Fetch the verification code
        const codeResponse = await axios.get(`/api/get-verification-code?email=${payload.email}`);
        if (!codeResponse.data.success) {
          toast({
            title: "Error",
            description: "Issue in sending Verification Code to fetch verification code",
            variant: "destructive",
          });
          return;
        }
        const verificationCode = codeResponse.data.verifyCode;


        // 3. Now send the verification email
        const emailResponse = await axios.post("/api/send-email", {
          name: payload.name,
          email: payload.email,
          role: payload.role, // make sure role is part of your signup form
          verificationCode: verificationCode, // you must get this from backend or generate here
        });

        if (emailResponse.data.success) {
          toast({
            title: "Verification email sent",
            description: "Check your inbox for the code.",
          });
          router.replace(`verify/${encodeURIComponent(payload.email)}`);
        } else {
          toast({
            title: "Email Error",
            description: "Could not send verification email.",
            variant: "destructive",
          });
        }
        
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Handle role change with type safety
  const handleRoleChange = (value: string) => {
    if (["student", "professor", "hod"].includes(value)) {
      setRole(value as "student" | "professor" | "hod");
    } else {
      toast({
        title: "Error",
        description: "Invalid role selected",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Attendance Portal
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>Create a new account to access the attendance portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                {isCodeRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="code">Enter Invitation Code (Ignore, if you are creating class as HOD)</Label>
                    <Input
                      id="code"
                      placeholder="e.g., PROF1234 or STUD5678"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className={isCodeValid === false ? "border-red-500" : ""}
                    />
                    {isCodeValid === false && (
                      <p className="text-sm text-red-500">Invalid invitation code</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <RadioGroup value={role} onValueChange={handleRoleChange} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hod" id="hod" />
                      <Label htmlFor="hod">HOD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professor" id="professor" />
                      <Label htmlFor="professor">Professor</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </div>
                  </div>
                </div>

                {role === "student" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rollNo">Roll Number</Label>
                        <Input
                          id="rollNo"
                          name="rollNo"
                          placeholder="e.g., I092"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          placeholder="e.g., 60003220170"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select name="class" required>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SY-IT1">SY-IT1</SelectItem>
                            <SelectItem value="SY-IT2">SY-IT2</SelectItem>
                            <SelectItem value="SY-IT3">SY-IT3</SelectItem>
                            <SelectItem value="TY-IT1">TY-IT1</SelectItem>
                            <SelectItem value="TY-IT2">TY-IT2</SelectItem>
                            <SelectItem value="TY-IT3">TY-IT3</SelectItem>
                            <SelectItem value="BE-IT1">BE-IT1</SelectItem>
                            <SelectItem value="BE-IT2">BE-IT2</SelectItem>
                            <SelectItem value="BE-IT3">BE-IT1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={department}
                        placeholder="Department"
                        onChange={(e) => setDepartment(e.target.value)}
                        readOnly={!isHOD}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input
                        id="college"
                        name="college"
                        value={college}
                        placeholder="College Name"
                        onChange={(e) => setCollege(e.target.value)}
                        readOnly={!isHOD}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="e.g., +91 9137102892"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (Optional)</Label>
                      <Select name="gender">
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Picture (Optional)</h3>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your image here or click to browse
                      </p>
                      <Input
                        id="profilePicture"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("profilePicture")?.click()}
                      >
                        Select Image
                      </Button>
                      {profilePicture && (
                        <p className="text-sm mt-2">Selected: {profilePicture.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted file types: JPG, PNG (Max size: 5MB)
                  </p>
                </div> */}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || (isCodeRequired && !isCodeValid)}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}