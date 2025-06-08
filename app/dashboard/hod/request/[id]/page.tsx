"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, Download, FileText, MapPin, User, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { attendanceRequests, generateMockRequests } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

// Combine the initial requests with generated ones
const allRequests = [...attendanceRequests, ...generateMockRequests(20)]

export default function HodRequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch request details
    setTimeout(() => {
      const foundRequest = allRequests.find((req) => req.id === params.id)
      if (foundRequest) {
        setRequest(foundRequest)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleApprove = () => {
    // Simulate API call
    toast({
      title: "Request Approved, Reload to see changes",
      description: "The attendance request has been approved.",
    })
    setRequest({ ...request, status: "Approved" })
  }

  const handleReject = () => {
    // Simulate API call
    toast({
      title: "Request Rejected, Reload to see changes",
      description: "The attendance request has been rejected.",
    })
    setRequest({ ...request, status: "Rejected" })
  }

  if (loading) {
    return (
      <DashboardLayout role="hod">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!request) {
    return (
      <DashboardLayout role="hod">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/dashboard/hod")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Request Details</h1>
            <p className="text-muted-foreground">Review and manage attendance request</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/hod")}>
            Back to Dashboard
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">{request.eventName}</CardTitle>
                  <CardDescription>{request.date}</CardDescription>
                </div>
                <StatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-muted-foreground">{request.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Roll Number</p>
                      <p className="text-muted-foreground">{request.rollNo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Class</p>
                      <p className="text-muted-foreground">{request.class}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Event Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{request.eventLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{request.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Supporting Document</p>
                      <Button variant="link" className="p-0 h-auto text-primary" asChild>
                        <a href={request.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1 inline" />
                          Download Document
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Class Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Professor</p>
                      <p className="text-muted-foreground">{request.professorName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Subject</p>
                      <p className="text-muted-foreground">{request.subject}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Request Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Request Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Request Submitted</p>
                      <p className="text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {request.status !== "Pending" && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          request.status === "Rejected"
                            ? "bg-destructive/10"
                            : request.status === "Approved"
                              ? "bg-green-500/10"
                              : "bg-primary/10"
                        }`}
                      >
                        <FileText
                          className={`h-4 w-4 ${
                            request.status === "Rejected"
                              ? "text-destructive"
                              : request.status === "Approved"
                                ? "text-green-500"
                                : "text-primary"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {request.status === "Rejected"
                            ? "Request Rejected, Reload to see changes"
                            : request.status === "Approved"
                              ? "Request Approved, Reload to see changes"
                              : "Attendance Granted"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(new Date(request.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "Attendance Granted" && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Attendance Marked</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(new Date(request.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {request.status === "Pending" && (
                <>
                  <Button variant="outline" className="gap-1" onClick={handleReject}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button className="gap-1" onClick={handleApprove}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </>
              )}
              {request.status === "Rejected" && (
                <Button variant="outline" className="gap-1" onClick={handleApprove}>
                  Change to Approved
                </Button>
              )}
              {request.status === "Approved" && (
                <Button variant="outline" className="gap-1" onClick={handleReject}>
                  Change to Rejected
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
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
