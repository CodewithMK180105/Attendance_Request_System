"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimeField } from "@/components/ui/time-field";
import { useUser } from "@/context/UserContext";

export default function NewRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("10:00");
  const [file, setFile] = useState<File | null>(null);
  const eventNameRef = useRef<HTMLInputElement>(null);
  const eventLocationRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const professorRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("rollNo", user?.rollNo || "");
      formData.append("division", user?.division || "");
      formData.append("studentId", user?.userId || user?.studentCode || "");
      formData.append("eventName", eventNameRef.current?.value || "");
      formData.append("eventLocation", eventLocationRef.current?.value || "");
      formData.append("eventDate", date ? format(date, "yyyy-MM-dd") : "");
      formData.append("lectureTime", time);
      formData.append("subject", subjectRef.current?.value || "");
      formData.append("professor", professorRef.current?.value || "");
      formData.append("reasonForAbsence", reasonRef.current?.value || "");
      formData.append("college", user?.college || "");
      formData.append("department", user?.department || "");
      if (file) {
        formData.append("supportingDocument", file);
      }

      const response = await axios.post("/api/request-form", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Request submitted successfully",
        description: response.data.message || "Your attendance request has been submitted and is pending approval.",
      });
      router.push("/dashboard/student");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "student") {
    return <div>Access denied. Please log in as a student.</div>;
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Attendance Request</h1>
          <p className="text-muted-foreground">Submit a new request for attendance approval</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Attendance Request Form</CardTitle>
                <CardDescription>Fill in the details about the event and the class you will miss</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={user.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number</Label>
                      <Input id="rollNo" value={user.rollNo || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division</Label>
                      <Input id="division" value={user.division || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userId">Student ID</Label>
                      <Input id="userId" value={user.userId || user.studentCode || ""} disabled />
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input id="eventName" placeholder="Enter event name" ref={eventNameRef} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Event Location</Label>
                      <Input id="eventLocation" placeholder="Enter event location" ref={eventLocationRef} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? format(date, "PPP") : <span>Select a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Lecture Time</Label>
                      <TimeField value={time} onChange={setTime} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Class Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Class Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Enter subject name" ref={subjectRef} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professor">Professor</Label>
                      <Input id="professor" placeholder="Enter professor name" ref={professorRef} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Absence</Label>
                    <Textarea
                      id="reason"
                      placeholder="Briefly explain why you need to attend this event"
                      rows={3}
                      ref={reasonRef}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportingDocument">Supporting Document (Optional)</Label>
                    <Input
                      id="supportingDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/student")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}