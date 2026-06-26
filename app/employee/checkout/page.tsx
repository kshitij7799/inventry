'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Equipment {
  _id: string;
  equipmentId: string;
  name: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  category: string;
  location: string;
  condition: string;
}

export default function CheckoutPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/equipment');
      const data = await response.json();
      if (data.success) {
        setEquipment(data.data.equipment);
      }
    } catch (error) {
      console.error('[v0] Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedEquipment || quantity < 1) {
      setError('Please select equipment and specify a quantity');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/employee/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedEquipment,
          quantityCheckout: quantity,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess(`Successfully checked out: ${data.data.equipment} (${data.data.quantity} units)`);
      setSelectedEquipment('');
      setQuantity(1);
      setNotes('');
      fetchEquipment();
    } catch (error) {
      setError('Failed to checkout equipment');
      console.error('[v0] Checkout error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEq = equipment.find((e) => e.equipmentId === selectedEquipment);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Checkout Equipment</h1>
        <p className="text-muted-foreground mt-1">Request to check out equipment from the lab</p>
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
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Select Equipment
                </label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose equipment...</option>
                  {equipment.map((eq) => (
                    <option key={eq._id} value={eq.equipmentId}>
                      {eq.name} ({eq.availableQuantity} available)
                    </option>
                  ))}
                </select>
              </div>

              {selectedEq && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedEq.availableQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: {selectedEq.availableQuantity}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Why are you checking this out? Any special requirements?"
                      rows={3}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="bg-muted/50 rounded p-3 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Location:</span>{' '}
                      <span className="font-medium text-foreground">{selectedEq.location}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Condition:</span>{' '}
                      <span className="font-medium text-foreground capitalize">
                        {selectedEq.condition}
                      </span>
                    </p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={submitting || !selectedEquipment}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting ? 'Checking Out...' : 'Checkout Equipment'}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-foreground mb-4">Available Equipment</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground">Loading equipment...</p>
            </div>
          ) : equipment.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No equipment available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {equipment.map((eq) => (
                <div
                  key={eq._id}
                  className={`bg-card border rounded-lg p-4 cursor-pointer transition ${
                    selectedEquipment === eq.equipmentId
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedEquipment(eq.equipmentId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{eq.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{eq.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">ID</p>
                          <p className="font-mono font-semibold text-foreground">{eq.equipmentId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-semibold text-foreground">{eq.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-semibold text-foreground">{eq.totalQuantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Available</p>
                          <p
                            className={`font-semibold ${
                              eq.availableQuantity > 0 ? 'text-primary' : 'text-destructive'
                            }`}
                          >
                            {eq.availableQuantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        eq.availableQuantity > 0
                          ? 'bg-primary/20 text-primary'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {eq.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
