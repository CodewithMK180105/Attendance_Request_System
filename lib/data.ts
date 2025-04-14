// Mock data for the application

// User profiles
export const users = {
  student: {
    id: "s1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    rollNo: "CS2021001",
    studentId: "STU001",
    class: "CS-3A",
    department: "Computer Science",
    contactNumber: "+91 9876543210",
    gender: "Male",
    profilePicture: "/placeholder.svg",
  },
  hod: {
    id: "h1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "hod",
    department: "Computer Science",
    contactNumber: "+91 9876543211",
    gender: "Female",
    profilePicture: "/placeholder.svg",
  },
  professor: {
    id: "p1",
    name: "Prof. Michael Smith",
    email: "michael.smith@example.com",
    role: "professor",
    department: "Computer Science",
    contactNumber: "+91 9876543212",
    gender: "Male",
    profilePicture: "/placeholder.svg",
  },
}

// Professors list
export const professors = [
  { id: "p1", name: "Prof. Michael Smith" },
  { id: "p2", name: "Prof. Emily Johnson" },
  { id: "p3", name: "Prof. Robert Williams" },
  { id: "p4", name: "Prof. Jennifer Brown" },
]

// Subjects list
export const subjects = [
  { id: "sub1", name: "Data Structures" },
  { id: "sub2", name: "Database Management" },
  { id: "sub3", name: "Computer Networks" },
  { id: "sub4", name: "Operating Systems" },
  { id: "sub5", name: "Web Development" },
]

// Classes list
export const classes = [
  { id: "c1", name: "CS-3A" },
  { id: "c2", name: "CS-3B" },
  { id: "c3", name: "CS-4A" },
  { id: "c4", name: "CS-4B" },
]

// Attendance requests
export const attendanceRequests = [
  {
    id: "req1",
    studentId: "s1",
    studentName: "John Doe",
    rollNo: "CS2021001",
    class: "CS-3A",
    eventName: "Tech Symposium 2023",
    eventLocation: "University Auditorium",
    date: "2023-11-15",
    time: "10:00 AM - 12:00 PM",
    subject: "Database Management",
    professorId: "p2",
    professorName: "Prof. Emily Johnson",
    fileUrl: "https://example.com/document1.pdf",
    status: "Pending",
    createdAt: "2023-11-10T09:30:00Z",
  },
  {
    id: "req2",
    studentId: "s1",
    studentName: "John Doe",
    rollNo: "CS2021001",
    class: "CS-3A",
    eventName: "Coding Competition",
    eventLocation: "IT Block",
    date: "2023-11-18",
    time: "2:00 PM - 5:00 PM",
    subject: "Data Structures",
    professorId: "p1",
    professorName: "Prof. Michael Smith",
    fileUrl: "https://example.com/document2.pdf",
    status: "Approved",
    createdAt: "2023-11-12T14:20:00Z",
  },
  {
    id: "req3",
    studentId: "s1",
    studentName: "John Doe",
    rollNo: "CS2021001",
    class: "CS-3A",
    eventName: "IEEE Workshop",
    eventLocation: "Conference Hall",
    date: "2023-11-20",
    time: "9:00 AM - 11:00 AM",
    subject: "Computer Networks",
    professorId: "p3",
    professorName: "Prof. Robert Williams",
    fileUrl: "https://example.com/document3.pdf",
    status: "Rejected",
    createdAt: "2023-11-14T10:15:00Z",
  },
  {
    id: "req4",
    studentId: "s1",
    studentName: "John Doe",
    rollNo: "CS2021001",
    class: "CS-3A",
    eventName: "Hackathon 2023",
    eventLocation: "Innovation Center",
    date: "2023-11-25",
    time: "8:00 AM - 8:00 PM",
    subject: "Web Development",
    professorId: "p4",
    professorName: "Prof. Jennifer Brown",
    fileUrl: "https://example.com/document4.pdf",
    status: "Attendance Granted",
    createdAt: "2023-11-16T08:45:00Z",
  },
  {
    id: "req5",
    studentId: "s2",
    studentName: "Jane Smith",
    rollNo: "CS2021002",
    class: "CS-3A",
    eventName: "Research Symposium",
    eventLocation: "Research Block",
    date: "2023-11-22",
    time: "1:00 PM - 3:00 PM",
    subject: "Operating Systems",
    professorId: "p1",
    professorName: "Prof. Michael Smith",
    fileUrl: "https://example.com/document5.pdf",
    status: "Approved",
    createdAt: "2023-11-17T11:30:00Z",
  },
]

// Generate more mock attendance requests
export const generateMockRequests = (count: number) => {
  const statuses = ["Pending", "Approved", "Rejected", "Attendance Granted"]
  const mockRequests = []

  for (let i = 0; i < count; i++) {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
    const randomProfessor = professors[Math.floor(Math.random() * professors.length)]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const randomClass = classes[Math.floor(Math.random() * classes.length)]

    // Generate a random date within the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    mockRequests.push({
      id: `req${attendanceRequests.length + i + 1}`,
      studentId: "s1",
      studentName: "John Doe",
      rollNo: "CS2021001",
      class: randomClass.name,
      eventName: `Event ${i + 1}`,
      eventLocation: "Campus",
      date: date.toISOString().split("T")[0],
      time: "10:00 AM - 12:00 PM",
      subject: randomSubject.name,
      professorId: randomProfessor.id,
      professorName: randomProfessor.name,
      fileUrl: "https://example.com/document.pdf",
      status: randomStatus,
      createdAt: date.toISOString(),
    })
  }

  return [...attendanceRequests, ...mockRequests]
}

// Generate a list of students
export const students = [
  {
    id: "s1",
    name: "John Doe",
    rollNo: "CS2021001",
    class: "CS-3A",
    department: "Computer Science",
  },
  {
    id: "s2",
    name: "Jane Smith",
    rollNo: "CS2021002",
    class: "CS-3A",
    department: "Computer Science",
  },
  {
    id: "s3",
    name: "Michael Johnson",
    rollNo: "CS2021003",
    class: "CS-3A",
    department: "Computer Science",
  },
  {
    id: "s4",
    name: "Emily Brown",
    rollNo: "CS2021004",
    class: "CS-3B",
    department: "Computer Science",
  },
  {
    id: "s5",
    name: "David Wilson",
    rollNo: "CS2021005",
    class: "CS-3B",
    department: "Computer Science",
  },
]
