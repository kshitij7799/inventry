'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface User {
  employeeId: string;
  name: string;
  email: string;
  role: string;
}

export function AdminNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  };

  return (
    <nav className="bg-sidebar border-b border-sidebar-border px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-sidebar-foreground/60 text-sm">Welcome back,</p>
        <p className="text-sidebar-foreground font-semibold">{user?.name || 'Admin'}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-sidebar-foreground/60 bg-sidebar-accent px-3 py-1 rounded">
          {user?.role === 'admin' ? 'Administrator' : 'User'}
        </span>
        <Button
          onClick={handleLogout}
          className="bg-destructive hover:bg-destructive/90 text-white text-sm"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
