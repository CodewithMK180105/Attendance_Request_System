"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Search, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { generateMockRequests } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Filter only approved requests
const approvedRequests = generateMockRequests(25).filter((req) => req.status === "Approved")

export default function ProfessorDashboard() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all_dates")

  // Filter requests based on search query and filters
  const filteredRequests = approvedRequests
    .filter((request) => {
      if (searchQuery === "") return true
      return (
        request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .filter((request) => {
      if (classFilter === "all") return true
      return request.class === classFilter
    })
    .filter((request) => {
      if (subjectFilter === "all") return true
      return request.subject === subjectFilter
    })
    .filter((request) => {
      if (dateFilter === "all_dates") return true
      return request.date === dateFilter
    })
    // Sort by roll number
    .sort((a, b) => a.rollNo.localeCompare(b.rollNo))

  // Get unique classes, subjects, and dates
  const uniqueClasses = Array.from(new Set(approvedRequests.map((req) => req.class)))
  const uniqueSubjects = Array.from(new Set(approvedRequests.map((req) => req.subject)))
  const uniqueDates = Array.from(new Set(approvedRequests.map((req) => req.date)))

  const handleGrantAttendance = (requestId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Attendance Granted",
      description: "The student's attendance has been marked as present.",
    })
  }

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
          {/* <p className="text-muted-foreground">
            Welcome back, Prof. Michael! Manage approved attendance requests here.
          </p> */}
        </div>

        {/* Stats Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Attendance Approvals</CardTitle>
              <div className="h-4 w-4 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequests.length}</div>
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
                    setSearchQuery("")
                    setClassFilter("all")
                    setSubjectFilter("all")
                    setDateFilter("all_dates")
                  }}
                  disabled={
                    searchQuery === "" && classFilter === "all" && subjectFilter === "all" && dateFilter === "all_dates"
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
                              <Badge variant="secondary">Approved by HOD</Badge>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{request.studentName}</span> • {request.rollNo} •{" "}
                              {request.class}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.subject} • {request.date} • {request.time}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* <Button variant="outline" size="sm" asChild>
                              <a href={request.fileUrl} target="_blank" rel="noopener noreferrer">
                                View Document
                              </a>
                            </Button> */}

                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleGrantAttendance(request.id)}
                            >
                              <Check className="h-4 w-4" /> Attendance Granted
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
