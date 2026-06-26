'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Equipment {
  _id: string;
  name: string;
  quantity: number;
}

interface Checkout {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  checkoutDate: string;
  returnDate?: string;
  status: 'active' | 'returned';
}

export default function EmployeeDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const equipRes = await fetch('/api/employee/equipment');
      if (equipRes.ok) {
        const data = await equipRes.json();
        setEquipment(data);
      }

      const checkoutRes = await fetch('/api/employee/checkouts');
      if (checkoutRes.ok) {
        const data = await checkoutRes.json();
        setCheckouts(data);
      }
    } catch (error) {
      console.error('[v0] Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedEquipment || quantity <= 0) {
      alert('Please select equipment and quantity');
      return;
    }

    try {
      const res = await fetch('/api/employee/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentId: selectedEquipment, quantity, notes }),
      });

      if (res.ok) {
        alert('Equipment checked out successfully!');
        setSelectedEquipment('');
        setQuantity(1);
        setNotes('');
        loadDashboard();
      } else {
        const error = await res.json();
        alert(error.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('[v0] Checkout error:', error);
      alert('Error checking out equipment');
    }
  };

  const handleReturn = async (checkoutId: string) => {
    if (!confirm('Are you sure you want to return this equipment?')) return;

    try {
      const res = await fetch('/api/employee/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId, condition: 'good' }),
      });

      if (res.ok) {
        alert('Equipment returned successfully!');
        loadDashboard();
      }
    } catch (error) {
      console.error('[v0] Return error:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Dashboard</h1>
          <p className="text-muted-foreground">Equipment Checkout & Return</p>
        </div>
        <Button onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-white">
          Logout
        </Button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border p-4 flex gap-4">
        {(['checkout', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'checkout' ? 'Checkout Equipment' : 'My History'}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-6 max-w-4xl mx-auto">
        {activeTab === 'checkout' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Request Equipment Checkout</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Select Equipment</label>
                  <select
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose equipment...</option>
                    {equipment.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} ({item.quantity} available)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this checkout..."
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
                >
                  Request Checkout
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Available Equipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((item) => (
                  <div key={item._id} className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Available: {item.quantity}</p>
                    <div
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                        item.quantity > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Checkout History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground">Equipment</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Checkout Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {checkouts.map((checkout) => (
                    <tr key={checkout._id} className="border-b border-border hover:bg-muted/5">
                      <td className="py-3 px-4 text-foreground">{checkout.equipmentName}</td>
                      <td className="py-3 px-4 text-foreground">{checkout.quantity}</td>
                      <td className="py-3 px-4 text-foreground">
                        {new Date(checkout.checkoutDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            checkout.status === 'active'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {checkout.status === 'active' ? 'Active' : 'Returned'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {checkout.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => handleReturn(checkout._id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                          >
                            Return
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {checkouts.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No checkouts yet</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
