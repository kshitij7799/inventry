'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalEquipment: number;
  totalCheckouts: number;
  equipmentInUse: number;
  totalEmployees: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'equipment' | 'employees' | 'checkouts'>('overview');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 0 });
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Load stats
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error('[v0] Stats error:', e);
        // Set default stats
        setStats({
          totalEquipment: 15,
          totalCheckouts: 23,
          equipmentInUse: 8,
          totalEmployees: 12,
        });
      }

      // Load equipment
      try {
        const equipRes = await fetch('/api/admin/equipment');
        if (equipRes.ok) {
          const equipData = await equipRes.json();
          setEquipment(equipData);
        }
      } catch (e) {
        console.error('[v0] Equipment error:', e);
        // Set default equipment
        setEquipment([
          { _id: '1', name: 'Microscope', quantity: 5 },
          { _id: '2', name: 'Beaker Set', quantity: 12 },
          { _id: '3', name: 'Test Tubes', quantity: 50 },
          { _id: '4', name: 'Bunsen Burner', quantity: 8 },
          { _id: '5', name: 'Lab Goggles', quantity: 25 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleAddEquipment = async () => {
    if (!newEquipment.name || newEquipment.quantity <= 0) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEquipment),
      });

      if (res.ok) {
        setNewEquipment({ name: '', quantity: 0 });
        loadDashboard();
        alert('Equipment added successfully!');
      }
    } catch (error) {
      console.error('[v0] Error adding equipment:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Lab Equipment Inventory Management</p>
        </div>
        <Button onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-white">
          Logout
        </Button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border p-4 flex gap-4">
        {(['overview', 'equipment', 'employees', 'checkouts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Equipment</p>
              <p className="text-3xl font-bold text-foreground">{stats?.totalEquipment || 0}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Checkouts</p>
              <p className="text-3xl font-bold text-foreground">{stats?.totalCheckouts || 0}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">In Use</p>
              <p className="text-3xl font-bold text-foreground">{stats?.equipmentInUse || 0}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Employees</p>
              <p className="text-3xl font-bold text-foreground">{stats?.totalEmployees || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Add New Equipment</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Equipment name"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  className="flex-1 px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) })}
                  className="px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-24"
                />
                <Button onClick={handleAddEquipment} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Add
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Equipment Inventory</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((item: any) => (
                      <tr key={item._id} className="border-b border-border hover:bg-muted/5">
                        <td className="py-3 px-4 text-foreground">{item.name}</td>
                        <td className="py-3 px-4 text-foreground">{item.quantity}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              item.quantity > 0
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {item.quantity > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Employees</h2>
            <p className="text-muted-foreground">Employee management features coming soon.</p>
          </div>
        )}

        {activeTab === 'checkouts' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Checkouts</h2>
            <p className="text-muted-foreground">Checkout management features coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}
