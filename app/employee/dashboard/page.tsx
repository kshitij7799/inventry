'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Stats {
  currentlyCheckedOut: number;
  totalReturned: number;
  overdue: number;
}

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<Stats>({
    currentlyCheckedOut: 0,
    totalReturned: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/employee/history');
        const data = await response.json();

        if (data.success && data.data.stats) {
          setStats({
            currentlyCheckedOut: data.data.stats.currentlyCheckedOut,
            totalReturned: data.data.stats.totalReturned,
            overdue: data.data.stats.overdue,
          });
        }
      } catch (error) {
        console.error('[v0] Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your equipment checkouts</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Currently Checked Out</p>
              <p className="text-3xl font-bold text-accent mt-2">{stats.currentlyCheckedOut}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Total Returned</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalReturned}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Overdue Items</p>
              <p className="text-3xl font-bold text-destructive mt-2">{stats.overdue}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/employee/checkout">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Checkout Equipment</h3>
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Request to check out equipment from the lab
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Checkout
                </Button>
              </div>
            </Link>

            <Link href="/employee/checkouts">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">My Checkouts</h3>
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  View and manage your active equipment checkouts
                </p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  View Checkouts
                </Button>
              </div>
            </Link>

            <Link href="/employee/history">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Checkout History</h3>
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  View your complete checkout and return history
                </p>
                <Button className="bg-muted hover:bg-muted/80 text-foreground">
                  View History
                </Button>
              </div>
            </Link>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Guidelines</h3>
                <span className="text-2xl">ℹ️</span>
              </div>
              <ul className="text-sm space-y-2 text-foreground">
                <li>• Check availability before requesting equipment</li>
                <li>• Return equipment on time in good condition</li>
                <li>• Report any damage immediately</li>
                <li>• Keep your checkout history clean</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
