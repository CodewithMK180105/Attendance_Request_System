"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, FileCheck, FileClock, FileX, Filter, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useUser } from "@/context/UserContext"

interface AttendanceRequest {
  _id: string
  student: {
    name: string
    rollNo: string
    class: string
    studentId: string
  }
  event: {
    eventName: string
    eventLocation: string
    eventDate: string
    lectureTime: string
  }
  classInfo: {
    subject: string
    professor: string
    reasonForAbsence: string
  }
  supportingDocument?: string
  status: "pending" | "approved" | "rejected" | "granted"
  college: string
  department: string
  createdAt?: string
  updatedAt?: string
}

export default function StudentDashboard() {
  const [filter, setFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const { user } = useUser()
  const [requests, setRequests] = useState<AttendanceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !user.userId) {
      console.log("No user or userId available, skipping fetch:", { user });
      setLoading(false)
      return;
    }

    console.log("Fetching requests for user:", user);

    const fetchRequests = async () => {
      console.log("Fetching student-specific requests for userId:", user.userId);
      try {
        const headers: HeadersInit = {};
        if (user.userId) {
          headers["x-userId"] = user.userId;
        }

        const res = await fetch("/api/get-student-specific-requests", {
          method: "GET",
          headers,
        });
        const json = await res.json();
        console.log("Fetched requests:", json);
        if (json.success) {
          const formattedRequests = json.data.map((req: any) => ({
            ...req,
            _id: req._id.toString(),
            event: {
              ...req.event,
              eventDate: new Date(req.event.eventDate).toLocaleDateString("en-IN"),
            },
            createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : undefined,
            updatedAt: req.updatedAt ? new Date(req.updatedAt).toISOString() : undefined,
          }));
          setRequests(formattedRequests);
        } else {
          console.error("API error:", json.message);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const filteredRequests = requests
    .filter((request) => {
      if (filter === "all") return true;
      return request.status.toLowerCase() === filter.toLowerCase();
    })
    .filter((request) => {
      if (subjectFilter === "all") return true;
      return request.classInfo.subject === subjectFilter;
    });

  const pendingCount = requests.filter((req) => req.status.toLowerCase() === "pending").length;
  const approvedCount = requests.filter((req) => req.status.toLowerCase() === "approved").length;
  const rejectedCount = requests.filter((req) => req.status.toLowerCase() === "rejected").length;
  const grantedCount = requests.filter((req) => req.status.toLowerCase() === "granted").length;

  const uniqueSubjects = Array.from(new Set(requests.map((req) => req.classInfo.subject)));

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        {user ? (
          <p className="text-muted-foreground">
            Welcome back, {user.name || "Student"}! Manage your attendance requests here.
          </p>
        ) : (
          <p className="text-red-500">Please log in to view your attendance requests.</p>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Approved by HOD</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                <FileX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedCount}</div>
                <p className="text-xs text-muted-foreground">Rejected by HOD</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Granted Requests</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{grantedCount}</div>
                <p className="text-xs text-muted-foreground">Granted by HOD</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-end">
          <Button asChild>
            <Link href="/dashboard/student/new-request">Create New Request</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Requests</CardTitle>
            <CardDescription>View and manage all your attendance requests</CardDescription>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>

              <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="granted">Granted</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="w-full sm:w-40">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {uniqueSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No attendance requests found. Create a new request to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{request.event.eventName}</h3>
                              <Badge
                                variant={
                                  request.status.toLowerCase() === "pending"
                                    ? "outline"
                                    : request.status.toLowerCase() === "approved"
                                    ? "secondary"
                                    : request.status.toLowerCase() === "granted"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{request.student.name}</span> • {request.student.rollNo} • {request.student.class}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.classInfo.subject || "N/A"} • {request.classInfo.professor || "N/A"} • {request.event.eventDate} • {request.event.lectureTime}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {request.supportingDocument && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={request.supportingDocument} target="_self" rel="noopener noreferrer">
                                  View Document
                                </a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/student/request/${request._id}`}>Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}