'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/employees');
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data.employees);
      }
    } catch (error) {
      console.error('[v0] Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (employeeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('[v0] Failed to update employee:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Employee Management</h1>
        <p className="text-muted-foreground mt-1">Manage registered employees</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No employees registered yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-sm text-foreground font-mono">{emp.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{emp.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        emp.isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      onClick={() => toggleEmployeeStatus(emp.employeeId, emp.isActive)}
                      className={`text-xs ${
                        emp.isActive
                          ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive'
                          : 'bg-primary/20 hover:bg-primary/30 text-primary'
                      }`}
                    >
                      {emp.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
