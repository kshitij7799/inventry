'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/helpers';

interface Checkout {
  _id: string;
  checkoutId: string;
  quantityCheckout: number;
  checkoutDateTime: string;
  status: string;
  equipment: any[];
  notes: string;
}

export default function MyCheckoutsPage() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNotes, setReturnNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/checkout');
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

  const handleReturn = async () => {
    if (!selectedCheckout) return;

    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      const response = await fetch('/api/employee/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId: selectedCheckout,
          returnCondition,
          notes: returnNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess('Equipment returned successfully!');
      setSelectedCheckout(null);
      setReturnCondition('good');
      setReturnNotes('');
      fetchCheckouts();
    } catch (error) {
      setError('Failed to return equipment');
      console.error('[v0] Return error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCheckoutData = checkouts.find((c) => c.checkoutId === selectedCheckout);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">My Checkouts</h1>
        <p className="text-muted-foreground mt-1">View and manage your active equipment</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Checkouts</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground">Loading checkouts...</p>
            </div>
          ) : checkouts.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No active checkouts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checkouts.map((checkout) => {
                const equipment = checkout.equipment?.[0];
                return (
                  <div
                    key={checkout._id}
                    className={`bg-card border rounded-lg p-4 cursor-pointer transition ${
                      selectedCheckout === checkout.checkoutId
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCheckout(checkout.checkoutId)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{equipment?.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {checkout.checkoutId}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-accent/20 text-accent">
                        Checked Out
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-semibold text-foreground">{checkout.quantityCheckout}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Checkout Date</p>
                        <p className="font-semibold text-foreground">
                          {formatDate(new Date(checkout.checkoutDateTime))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{equipment?.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Condition</p>
                        <p className="font-semibold text-foreground capitalize">
                          {equipment?.condition}
                        </p>
                      </div>
                    </div>

                    {checkout.notes && (
                      <div className="bg-muted/50 rounded p-2 text-xs">
                        <p className="text-muted-foreground">Notes:</p>
                        <p className="text-foreground">{checkout.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedCheckout && selectedCheckoutData && (
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Return Equipment</h2>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {selectedCheckoutData.equipment?.[0]?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quantity: {selectedCheckoutData.quantityCheckout}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Equipment Condition
                  </label>
                  <select
                    value={returnCondition}
                    onChange={(e) => setReturnCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Return Notes (Optional)
                  </label>
                  <textarea
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Any issues or notes about the equipment?"
                    rows={3}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button
                  onClick={handleReturn}
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {submitting ? 'Processing...' : 'Return Equipment'}
                </Button>

                <Button
                  onClick={() => setSelectedCheckout(null)}
                  className="w-full bg-muted hover:bg-muted/80 text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
