"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, FileCheck, FileX, Search, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { generateMockRequests } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Generate 30 mock requests
const allRequests = generateMockRequests(30)

export default function HodDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  // Filter requests based on status and search query
  const filteredRequests = allRequests
    .filter((request) => {
      if (activeTab === "pending") return request.status === "Pending"
      if (activeTab === "approved") return request.status === "Approved"
      if (activeTab === "rejected") return request.status === "Rejected"
      return true
    })
    .filter((request) => {
      if (searchQuery === "") return true
      return (
        request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.eventName.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Get unique classes and subjects
  const uniqueClasses = Array.from(new Set(allRequests.map((req) => req.class)))
  const uniqueSubjects = Array.from(new Set(allRequests.map((req) => req.subject)))

  // Count requests by status
  const pendingCount = allRequests.filter((req) => req.status === "Pending").length
  const approvedCount = allRequests.filter((req) => req.status === "Approved").length
  const rejectedCount = allRequests.filter((req) => req.status === "Rejected").length

  const handleApprove = (requestId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Request Approved",
      description: "The attendance request has been approved.",
    })
  }

  const handleReject = (requestId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Request Rejected",
      description: "The attendance request has been rejected.",
    })
  }

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HOD Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Sarah! Manage attendance requests here.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <div className="h-4 w-4 rounded-full bg-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting your approval</p>
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
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Sent to professors</p>
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
                <div className="h-4 w-4 rounded-full bg-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedCount}</div>
                <p className="text-xs text-muted-foreground">Not approved</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Requests</CardTitle>
            <CardDescription>Review and manage attendance requests from students</CardDescription>

            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or event name..."
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

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("")
                    setClassFilter("all")
                    setSubjectFilter("all")
                  }}
                  disabled={searchQuery === "" && classFilter === "all" && subjectFilter === "all"}
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
                              <Badge
                                variant={
                                  request.status === "Pending"
                                    ? "outline"
                                    : request.status === "Approved"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{request.studentName}</span> • {request.rollNo} •{" "}
                              {request.class}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.subject} • {request.professorName} • {request.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={request.fileUrl} target="_blank" rel="noopener noreferrer">
                                View Document
                              </a>
                            </Button>

                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/hod/request/${request.id}`}>Details</Link>
                            </Button>

                            {request.status === "Pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <Check className="h-4 w-4" /> Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleReject(request.id)}
                                >
                                  <X className="h-4 w-4" /> Reject
                                </Button>
                              </>
                            )}

                            {request.status === "Rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleApprove(request.id)}
                              >
                                <FileCheck className="h-4 w-4" /> Re-approve
                              </Button>
                            )}

                            {request.status === "Approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleReject(request.id)}
                              >
                                <FileX className="h-4 w-4" /> Revoke
                              </Button>
                            )}
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
