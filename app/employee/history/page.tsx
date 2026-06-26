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
  returnCondition?: string;
  equipment: any[];
  notes: string;
}

interface Stats {
  totalCheckouts: number;
  currentlyCheckedOut: number;
  totalReturned: number;
  overdue: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Checkout[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCheckouts: 0,
    currentlyCheckedOut: 0,
    totalReturned: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/history');
      const data = await response.json();
      if (data.success) {
        setHistory(data.data.history);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('[v0] Failed to fetch history:', error);
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'bg-primary/10 text-primary';
      case 'fair':
        return 'bg-accent/10 text-accent';
      case 'damaged':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredHistory = filter
    ? history.filter((item) => item.status === filter)
    : history;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Checkout History</h1>
        <p className="text-muted-foreground mt-1">Your complete equipment checkout records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Checkouts</p>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.totalCheckouts}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Currently Out</p>
          <p className="text-3xl font-bold text-accent mt-2">{stats.currentlyCheckedOut}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Returned</p>
          <p className="text-3xl font-bold text-primary mt-2">{stats.totalReturned}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Overdue</p>
          <p className="text-3xl font-bold text-destructive mt-2">{stats.overdue}</p>
        </div>
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
            {status ? status.replace('_', ' ').toUpperCase() : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            {filter ? `No ${filter.replace('_', ' ')} items` : 'No checkout history'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Checkout Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Condition
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.map((item) => {
                const equipment = item.equipment?.[0];
                return (
                  <tr key={item._id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground font-mono">{item.checkoutId}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold text-foreground">{equipment?.name}</p>
                        <p className="text-xs text-muted-foreground">{equipment?.equipmentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.quantityCheckout}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatDate(new Date(item.checkoutDateTime))}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.returnDateTime ? formatDate(new Date(item.returnDateTime)) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.returnCondition ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(item.returnCondition)}`}>
                          {item.returnCondition.charAt(0).toUpperCase() +
                            item.returnCondition.slice(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
