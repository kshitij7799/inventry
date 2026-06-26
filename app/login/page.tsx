'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      if (data.success) {
        if (data.data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('[v0] Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lab Inventory</h1>
            <p className="text-muted-foreground text-sm">Equipment Tracking System</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-foreground mb-1">
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter your employee ID"
                required
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              This system ensures lab products are safe and accounted for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
