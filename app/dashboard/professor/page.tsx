"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";

// Define the AttendanceRequest interface based on the provided data structure
interface AttendanceRequest {
  _id: string;
  student: {
    name: string;
    rollNo: string;
    class: string;
    studentId: string;
  };
  event: {
    eventName: string;
    eventLocation: string;
    eventDate: string; // ISO date string, e.g., "2025-06-28T00:00:00.000Z"
    lectureTime: string;
  };
  classInfo: {
    subject: string;
    professor: string; // Email
    reasonForAbsence: string;
    supportingDocument?: string; // Optional URL
  };
  status: string;
  college: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ProfessorDashboard() {
  const { toast } = useToast();
  const { user, loading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all_dates");
  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch attendance requests
  useEffect(() => {
    if (user?.college && user?.department && user?.email) {
      const fetchRequests = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get<{ success: boolean; data: AttendanceRequest[] }>(
            "/api/get-requests-for-professor",
            {
              headers: {
                "x-college": user.college,
                "x-department": user.department,
                "x-email": user.email,
              },
            }
          );
          if (response.data.success) {
            setRequests(response.data.data.filter((req) => req.status === "approved"));
            console.log("Fetched requests:", response.data.data);
          } else {
            throw new Error("Failed to fetch requests");
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch attendance requests",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchRequests();
    }
  }, [user, toast]);

  // Format date for filtering and display
  const formatDate = (date: string) => {
    return format(new Date(date), "yyyy-MM-dd"); // e.g., "2025-06-28"
  };

  // Filter requests based on search query and filters
  const filteredRequests = requests
    .filter((request) => {
      if (searchQuery === "") return true;
      return (
        request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((request) => {
      if (classFilter === "all") return true;
      return request.student.class === classFilter;
    })
    .filter((request) => {
      if (subjectFilter === "all") return true;
      return request.classInfo.subject === subjectFilter;
    })
    .filter((request) => {
      if (dateFilter === "all_dates") return true;
      return formatDate(request.event.eventDate) === dateFilter;
    })
    // Sort by roll number
    .sort((a, b) => a.student.rollNo.localeCompare(b.student.rollNo));

  // Get unique classes, subjects, and dates
  const uniqueClasses = Array.from(new Set(requests.map((req) => req.student.class)));
  const uniqueSubjects = Array.from(new Set(requests.map((req) => req.classInfo.subject)));
  const uniqueDates = Array.from(new Set(requests.map((req) => formatDate(req.event.eventDate))));

  const handleGrantAttendance = async (requestId: string) => {
    try {
      const response = await axios.post<{ success: boolean; message: string }>("/api/grant-attendance", {
        requestId,
      });
      if (response.data.success) {
        setRequests(requests.filter((req) => req._id !== requestId)); // Remove granted request
        toast({
          title: "Attendance Granted",
          description: "The student's attendance has been marked as present.",
        });
      } else {
        throw new Error("Failed to grant attendance");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant attendance",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "professor") {
    return <div>Access denied. Please log in as a professor.</div>;
  }

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Prof. {user.name}! Manage approved attendance requests here.
          </p>
        </div>

        {/* Stats Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Attendance Approvals</CardTitle>
              <div className="h-4 w-4 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">Requests approved by HOD awaiting your attendance grant</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Approved Attendance Requests</CardTitle>
            <CardDescription>Grant attendance for approved requests</CardDescription>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or roll number..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {uniqueClasses.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {uniqueSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_dates">All Dates</SelectItem>
                    {uniqueDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("");
                    setClassFilter("all");
                    setSubjectFilter("all");
                    setDateFilter("all_dates");
                  }}
                  disabled={
                    searchQuery === "" &&
                    classFilter === "all" &&
                    subjectFilter === "all" &&
                    dateFilter === "all_dates"
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No requests found matching your filters.</div>
              ) : (
                filteredRequests.map((request, index) => (
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
                              <Badge variant="secondary">Approved by HOD</Badge>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{request.student.name}</span> • {request.student.rollNo} •{" "}
                              {request.student.class}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.classInfo.subject} • {formatDate(request.event.eventDate)} •{" "}
                              {request.event.lectureTime}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {request.classInfo.supportingDocument && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={request.classInfo.supportingDocument}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Document
                                </a>
                              </Button>
                            )}

                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleGrantAttendance(request._id)}
                            >
                              <Check className="h-4 w-4" /> Grant Attendance
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
