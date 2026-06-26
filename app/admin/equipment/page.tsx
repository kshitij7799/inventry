"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipmentId: '',
    name: '',
    description: '',
    totalQuantity: 1,
    category: '',
    location: '',
    condition: 'good' as const,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/equipment');
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalQuantity' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess('Equipment added successfully!');
      setFormData({
        equipmentId: '',
        name: '',
        description: '',
        totalQuantity: 1,
        category: '',
        location: '',
        condition: 'good',
      });
      setShowForm(false);
      fetchEquipment();
    } catch (error) {
      setError('Failed to add equipment');
      console.error('[v0] Add equipment error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Equipment Management</h1>
          <p className="text-muted-foreground mt-1">Add and manage lab equipment</p>
        </div>
        <Link href="/admin/equipment/add">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Equipment</Button>
        </Link>
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

      

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground">Loading equipment...</p>
          </div>
        ) : equipment.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No equipment added yet</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Condition
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {equipment.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground font-mono">{item.equipmentId}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.totalQuantity}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.availableQuantity > 0
                            ? 'bg-primary/20 text-primary'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {item.availableQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
