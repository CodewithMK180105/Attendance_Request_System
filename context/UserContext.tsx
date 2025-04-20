"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  rollNo?: string;
  userId?: string;
  division?: string;
  department: string;
  college: string;
  contactNumber: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  profilePicture?: string;
  role: "hod" | "student" | "professor";
  studentCode?: string;
  professorCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user", {
        headers: { "Content-Type": "application/json" },
      });

      const fetchedUser = response.data.user;
      const validRoles = ["hod", "student", "professor"];
      if (!validRoles.includes(fetchedUser.role)) {
        throw new Error(`Invalid role: ${fetchedUser.role}`);
      }

      setUser(fetchedUser);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch user data");
      setUser(null);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await axios.put("/api/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data.user);
      setError(null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to update profile");
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post("/api/logout");
      setUser(null);
      setError(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to log out");
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}