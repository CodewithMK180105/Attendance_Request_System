"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, FileCheck, FileClock, FileX, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateMockRequests } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Generate 20 mock requests
const allRequests = generateMockRequests(20)

export default function StudentDashboard() {
  const [filter, setFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  // Filter requests based on status
  const filteredRequests = allRequests
    .filter((request) => {
      if (filter === "all") return true
      return request.status.toLowerCase() === filter.toLowerCase()
    })
    .filter((request) => {
      if (subjectFilter === "all") return true
      return request.subject === subjectFilter
    })

  // Count requests by status
  const pendingCount = allRequests.filter((req) => req.status === "Pending").length
  const approvedCount = allRequests.filter((req) => req.status === "Approved").length
  const rejectedCount = allRequests.filter((req) => req.status === "Rejected").length
  const grantedCount = allRequests.filter((req) => req.status === "Attendance Granted").length

  // Get unique subjects
  const uniqueSubjects = Array.from(new Set(allRequests.map((req) => req.subject)))

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Manage your attendance requests here.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="text-sm font-medium">Attendance Granted</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{grantedCount}</div>
                <p className="text-xs text-muted-foreground">Completed requests</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* New Request Button */}
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/dashboard/student/new-request">Create New Request</Link>
          </Button>
        </div>

        {/* Requests List */}
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
                  <TabsTrigger value="attendance granted">Granted</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="w-full sm:w-64">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by subject" />
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
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{request.eventName}</h3>
                              <StatusBadge status={request.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.subject} • {request.professorName}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{request.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{request.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={request.fileUrl} target="_blank" rel="noopener noreferrer">
                                View Document
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/student/request/${request.id}`}>Details</Link>
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
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"

  switch (status.toLowerCase()) {
    case "pending":
      variant = "outline"
      break
    case "approved":
      variant = "secondary"
      break
    case "rejected":
      variant = "destructive"
      break
    case "attendance granted":
      variant = "default"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}
