'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/helpers';

interface Checkout {
  _id: string;
  checkoutId: string;
  quantityCheckout: number;
  checkoutDateTime: string;
  returnDateTime?: string;
  status: string;
  employee: any[];
  equipment: any[];
}

export default function CheckoutsManagement() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchCheckouts();
  }, [filter]);

  const fetchCheckouts = async () => {
    try {
      setLoading(true);
      const url = filter ? `/api/admin/checkouts?status=${filter}` : '/api/admin/checkouts';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setCheckouts(data.data.checkouts);
      }
    } catch (error) {
      console.error('[v0] Failed to fetch checkouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_out':
        return 'bg-accent/20 text-accent';
      case 'returned':
        return 'bg-primary/20 text-primary';
      case 'overdue':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Checkouts</h1>
        <p className="text-muted-foreground mt-1">View and manage equipment checkouts</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'checked_out', 'returned', 'overdue'].map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {status ? status.replace('_', ' ').toUpperCase() : 'All Checkouts'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading checkouts...</p>
        </div>
      ) : checkouts.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            No checkouts found {filter ? `with status "${filter}"` : ''}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Checkout ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Checkout Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {checkouts.map((checkout) => {
                const employee = checkout.employee?.[0];
                const equipment = checkout.equipment?.[0];

                return (
                  <tr key={checkout._id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {checkout.checkoutId}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {employee?.name || 'Unknown'}
                      <br />
                      <span className="text-xs text-muted-foreground">{employee?.employeeId}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {equipment?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {checkout.quantityCheckout}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatDate(new Date(checkout.checkoutDateTime))}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {checkout.returnDateTime
                        ? formatDate(new Date(checkout.returnDateTime))
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          checkout.status
                        )}`}
                      >
                        {checkout.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
