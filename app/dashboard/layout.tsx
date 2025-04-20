import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { role: "hod" | "student" | "professor" };
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  return (
    <UserProvider>
      {/* Your existing dashboard layout content */}
      <div className="dashboard-container">
        {/* Example: Add a header or sidebar here */}
        {children}
      </div>
      <Toaster />
    </UserProvider>
  );
}