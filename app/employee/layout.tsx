import { EmployeeNavbar } from '@/components/employee/Navbar';
import { EmployeeSidebar } from '@/components/employee/Sidebar';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col">
        <EmployeeNavbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
