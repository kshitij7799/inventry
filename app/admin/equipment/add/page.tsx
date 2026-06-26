'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AddEquipmentPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    equipmentId: '',
    name: '',
    description: '',
    totalQuantity: 1,
    category: '',
    location: '',
    condition: 'good',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: name === 'totalQuantity' ? parseInt(value || '0') : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to add equipment');
        return;
      }

      setSuccess('Equipment added successfully');
      // navigate back to equipment list after a short delay
      setTimeout(() => router.push('/admin/equipment'), 700);
    } catch (err) {
      console.error('[v0] Add equipment error:', err);
      setError('Failed to add equipment');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // client-side guard: ensure current user is admin
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!res.ok || !data.success || data.data?.role !== 'admin') {
          router.push('/login');
          return;
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Equipment</h1>
        <p className="text-muted-foreground mt-1">Create a new equipment item in the inventory</p>
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

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Equipment ID</label>
            <input
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
              placeholder="Optional — auto-generated if left blank"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted border border-border rounded-md resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Total Quantity</label>
            <input
              name="totalQuantity"
              required
              type="number"
              min={1}
              value={formData.totalQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md"
            >
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Equipment'}
          </Button>

          <Button type="button" onClick={() => router.push('/admin/equipment')} className="bg-muted hover:bg-muted/80 text-foreground">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
