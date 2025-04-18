"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  // Handle redirect after successful login
  useEffect(() => {
    if (redirectPath) {
      console.log("Frontend: Attempting redirect to:", redirectPath);
      try {
        router.push(redirectPath);
        router.refresh();
        console.log("Frontend: router.push executed for:", redirectPath);
        // Fallback hard redirect
        setTimeout(() => {
          console.log("Frontend: Executing fallback redirect to:", redirectPath);
          window.location.href = redirectPath;
        }, 1000);
      } catch (error) {
        console.error("Frontend: Redirect error:", error);
        toast({
          title: "Redirect Error",
          description: "Failed to redirect to dashboard.",
          variant: "destructive",
        });
      }
    }
  }, [redirectPath, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      console.log("Frontend: Login attempt blocked: already loading");
      return;
    }
    setIsLoading(true);

    try {
      console.log("Frontend: Sending login request:", { email, role });
      const response = await axios.post(
        "/api/sign-in",
        { email, password, role },
        { withCredentials: true }
      );

      console.log("Frontend: API response:", response.data);
      console.log("Frontend: Response headers:", response.headers);

      if (response.data.success) {
        toast({
          title: "Logged in successfully",
          description: `You are now logged in as a ${role}.`,
        });

        // Set redirect path based on role
        let path = "";
        if (role === "student") {
          path = "/dashboard/student";
        } else if (role === "hod") {
          path = "/dashboard/hod";
        } else if (role === "professor") {
          path = "/dashboard/professor";
        } else {
          throw new Error("Invalid role selected");
        }

        console.log("Frontend: Setting redirect path:", path);
        setRedirectPath(path);
      } else {
        console.warn("Frontend: Login failed:", response.data.message);
        toast({
          title: "Login failed",
          description: response.data.message || "Unknown error occurred.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      // console.error("Frontend: Login error details:", error.response?.data);
      // console.error("Frontend: Error response headers:", error.response?.headers);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred during login.",
        variant: "destructive",
      });
      setIsLoading(false);
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
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <RadioGroup
                    defaultValue="student"
                    value={role}
                    onValueChange={setRole}
                    className="flex flex-col space-y-1"
                    disabled={isLoading}
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
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
                    </>
                  ) : (
                    "SignIn"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}