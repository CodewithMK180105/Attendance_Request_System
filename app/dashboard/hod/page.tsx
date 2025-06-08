"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, FileCheck, FileX, Search, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useUser } from "@/context/UserContext"

export default function HodDashboard() {
  const { toast } = useToast()

  const [allRequests, setAllRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const {user}= useUser();
  const [profileData, setProfileData] = useState(user || {
      name: "",
      email: "",
      department: "",
      college: "",
      contactNumber: "",
      gender: "",
      profilePicture: "",
      role: "hod",
      studentCode: "",
      professorCode: "",
  })

  useEffect(() => {
  if (!user || !user.college || !user.department) return;

  console.log("Fetching requests for user:", user)

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/get-requests", {
        method: "GET",
        headers: {
          "x-college": user.college,
          "x-department": user.department,
        },
      });
      const json = await res.json();
      console.log("Fetched requests:", json)
      if (json.success) {
        setAllRequests(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [user]);


  const filteredRequests = allRequests
    .filter((request) => {
      const status = request?.status?.toLowerCase()
      if (activeTab === "pending") return status === "pending"
      if (activeTab === "approved") return status === "approved"
      if (activeTab === "rejected") return status === "rejected"
      return true
    })
    .filter((request) => {
      if (searchQuery === "") return true
      return (
        request?.student?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        request?.event?.eventName?.toLowerCase()?.includes(searchQuery.toLowerCase())
      )
    })
    .filter((request) => {
      if (classFilter === "all") return true
      return request?.student?.class === classFilter
    })
    .filter((request) => {
      if (subjectFilter === "all") return true
      return request?.classInfo?.subject === subjectFilter
    })

  const uniqueClasses = Array.from(new Set(allRequests.map((req) => req?.student?.class).filter(Boolean)))
  const uniqueSubjects = Array.from(new Set(allRequests.map((req) => req?.classInfo?.subject).filter(Boolean)))

  const pendingCount = allRequests.filter((req) => req?.status?.toLowerCase() === "pending").length
  const approvedCount = allRequests.filter((req) => req?.status?.toLowerCase() === "approved").length
  const rejectedCount = allRequests.filter((req) => req?.status?.toLowerCase() === "rejected").length

  const updateRequestStatus = async (requestId: string, status: "approved" | "rejected") => {
    const res = await fetch("/api/update-request-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });

    const data = await res.json();
    if (data.success) {
      toast({ title: `Request ${status}, Reload to see changes` });
    } else {
      toast({ title: "Error", description: data.message });
    }
  };

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">HOD Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Pending Requests" count={pendingCount} color="bg-amber-500" delay={0.1} />
          <StatCard label="Approved Requests" count={approvedCount} color="bg-green-500" delay={0.2} />
          <StatCard label="Rejected Requests" count={rejectedCount} color="bg-red-500" delay={0.3} />
        </div>

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
                    {uniqueClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {uniqueSubjects.map((subj) => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No requests found matching your filters.</div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request, index) => {
                  // console.log("Rendering request:", request)
                  return (
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
                                <h3 className="font-semibold">{request?.event?.eventName}</h3>
                                <Badge
                                  variant={
                                    request?.status?.toLowerCase() === "pending"
                                      ? "outline"
                                      : request?.status?.toLowerCase() === "approved"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {request?.status}
                                </Badge>
                              </div>
                              <p className="text-sm">
                                <span className="font-medium">{request?.student?.name}</span> •{" "}
                                {request?.student?.rollNo} • {request?.student?.class}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {request?.classInfo?.subject} • {request?.classInfo?.professor} •{" "}
                                {request?.event?.eventDate?.slice(0, 10)} •{" "} {request?.event?.lectureTime}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={request?.supportingDocument} target="_self" rel="noopener noreferrer">
                                  View Document
                                </a>
                              </Button>

                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/hod/request/${request._id}`}>Details</Link>
                              </Button>

                              {request?.status?.toLowerCase() === "pending" && (
                                <>
                                  <Button variant="default" size="sm" className="gap-1" onClick={() => updateRequestStatus(request._id, "approved")}>
                                    <Check className="h-4 w-4" /> Approve
                                  </Button>
                                  <Button variant="destructive" size="sm" className="gap-1" onClick={() => updateRequestStatus(request._id, "rejected")}>
                                    <X className="h-4 w-4" /> Reject
                                  </Button>
                                </>
                              )}

                              {request?.status?.toLowerCase() === "rejected" && (
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => updateRequestStatus(request._id, "approved")}>
                                  <FileCheck className="h-4 w-4" /> Re-approve
                                </Button>
                              )}

                              {request?.status?.toLowerCase() === "approved" && (
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => updateRequestStatus(request._id, "rejected")}>
                                  <FileX className="h-4 w-4" /> Revoke
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, count, color, delay }: { label: string; count: number; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <div className={`h-4 w-4 rounded-full ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">Tracked by system</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
