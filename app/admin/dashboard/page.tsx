'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  activeCheckouts: number;
  totalEmployees: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to load stats');
        return;
      }

      if (!data.success) {
        setError(data.message || 'Unable to load stats');
        return;
      }

      setStats(data.data || data);
    } catch (err) {
      setError('Unable to load stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleGenerateCode = async () => {
    setError('');

    try {
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to generate code');
        return;
      }

      if (!data.success) {
        setError(data.message || 'Unable to generate code');
        return;
      }

      setGeneratedCode(data.data.registrationCode || data.data?.code || '');
    } catch (err) {
      setError('Unable to generate registration code');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your lab inventory</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Equipment</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loadingStats ? '...' : stats?.totalEquipment ?? 0}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Available</p>
          <p className="text-3xl font-bold text-primary mt-2">
            {loadingStats ? '...' : stats?.availableEquipment ?? 0}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Active Checkouts</p>
          <p className="text-3xl font-bold text-accent mt-2">
            {loadingStats ? '...' : stats?.activeCheckouts ?? 0}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Employees</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loadingStats ? '...' : stats?.totalEmployees ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Generate Employee Registration Code</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create a code for employees to register with their credentials
            </p>
            <Button
              onClick={handleGenerateCode}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Generate Code
            </Button>
            {generatedCode && (
              <div className="mt-4 p-4 bg-muted rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Your registration code:</p>
                <p className="font-mono text-lg font-bold text-foreground break-all">
                  {generatedCode}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  This code expires in 30 days. Share it securely with employees.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">System Information</h2>
        <div className="space-y-3 text-sm">
          <p className="text-foreground">
            <span className="text-muted-foreground">System Name:</span> Lab Inventory Manager
          </p>
          <p className="text-foreground">
            <span className="text-muted-foreground">Purpose:</span> Track equipment checkouts and returns
          </p>
          <p className="text-foreground">
            <span className="text-muted-foreground">Status:</span>{' '}
            <span className="text-primary font-semibold">Operational</span>
          </p>
        </div>
      </div>
    </div>
  );
}
