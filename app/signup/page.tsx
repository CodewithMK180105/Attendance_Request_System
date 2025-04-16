"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState("student")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [code, setCode] = useState("")
  const [department, setDepartment] = useState("")
  const [college, setCollege] = useState("")

  const isHOD = role === "hod"
  const isCodeRequired = !isHOD

  useEffect(() => {
    if (code.trim()) {
      const fakeCodeMapping: {
        [key: string]: { role: string; department: string; college: string };
      } = {
        PROF1234: { role: "professor", department: "Computer Science", college: "DJ Sanghvi" },
        STUD5678: { role: "student", department: "Information Technology", college: "DJ Sanghvi" },
      };
      
      const details = fakeCodeMapping[code.trim()];
      if (details) {
        setRole(details.role);
        setDepartment(details.department);
        setCollege(details.college);
      } else {
        setRole("student");
        setDepartment("");
        setCollege("");
      }      
    }
  }, [code])

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Account created successfully",
        description: `You are now registered as a ${role}.`,
      })

      router.push("/login")
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Attendance Portal</Link>
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

                {/* Code input if not HOD */}
                {isCodeRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="code">Enter Invitation Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., PROF1234 or STUD5678"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <RadioGroup
                    defaultValue="student"
                    value={role}
                    onValueChange={setRole}
                    className="flex flex-col space-y-1"
                  >
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

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                {role === "student" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rollNo">Roll Number</Label>
                        <Input id="rollNo" placeholder="e.g., CS2021001" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input id="studentId" placeholder="e.g., STU001" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select required>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CS-3A">CS-3A</SelectItem>
                            <SelectItem value="CS-3B">CS-3B</SelectItem>
                            <SelectItem value="CS-4A">CS-4A</SelectItem>
                            <SelectItem value="CS-4B">CS-4B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={department}
                        placeholder="Department"
                        onChange={(e) => setDepartment(e.target.value)}
                        readOnly={role !== "hod"} // HOD can edit, others cannot
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input
                        id="college"
                        value={college}
                        placeholder="College Name"
                        onChange={(e) => setCollege(e.target.value)}
                        readOnly={role !== "hod"} // HOD can edit, others cannot
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" placeholder="e.g., +91 9876543210" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (Optional)</Label>
                      <Select>
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

                {/* Profile Picture */}
                <div className="space-y-4">
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
                        onClick={() =>
                          document.getElementById("profilePicture")?.click()
                        }
                      >
                        Select Image
                      </Button>
                      {profilePicture && (
                        <p className="text-sm mt-2">
                          Selected: {profilePicture.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted file types: JPG, PNG (Max size: 5MB)
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  )
}
