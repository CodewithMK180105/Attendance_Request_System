"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CalendarIcon, Upload } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { users } from "@/lib/data"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { TimeField } from "@/components/ui/time-field"

export default function NewRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("10:00")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Request submitted successfully",
        description: "Your attendance request has been submitted and is pending approval.",
      })
      router.push("/dashboard/student")
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
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
                      <Input id="name" value={users.student.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number</Label>
                      <Input id="rollNo" value={users.student.rollNo} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Input id="class" value={users.student.class} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input id="studentId" value={users.student.studentId} disabled />
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input id="eventName" placeholder="Enter event name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Event Location</Label>
                      <Input id="eventLocation" placeholder="Enter event location" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
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
                      <Input id="subject" placeholder="Enter subject name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professor">Professor</Label>
                      <Input id="professor" placeholder="Enter professor name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Absence</Label>
                    <Textarea
                      id="reason"
                      placeholder="Briefly explain why you need to attend this event"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Supporting Document */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Supporting Document</h3>
                  <div className="space-y-2">
                    <Label htmlFor="document">Upload Document</Label>
                    <div className="border rounded-md p-4">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag and drop your file here or click to browse</p>
                        <Input id="document" type="file" className="hidden" onChange={handleFileChange} required />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("document")?.click()}
                        >
                          Select File
                        </Button>
                        {selectedFile && <p className="text-sm mt-2">Selected: {selectedFile.name}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Accepted file types: PDF, JPG, PNG (Max size: 5MB)</p>
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
  )
}
