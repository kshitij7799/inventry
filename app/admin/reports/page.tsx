'use client';

import { useEffect, useState } from 'react';

interface ReportData {
  totalEquipment: number;
  lowStockItems: number;
  activeCheckouts: number;
  totalReturned: number;
  overdueItems: number;
  equipmentByCondition: {
    good: number;
    fair: number;
    damaged: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, checkoutsRes] = await Promise.all([
        fetch('/api/admin/equipment'),
        fetch('/api/admin/checkouts'),
      ]);

      const equipmentData = await equipmentRes.json();
      const checkoutsData = await checkoutsRes.json();

      if (equipmentData.success && checkoutsData.success) {
        const equipment = equipmentData.data.equipment || [];
        const checkouts = checkoutsData.data.checkouts || [];

        const report: ReportData = {
          totalEquipment: equipment.length,
          lowStockItems: equipment.filter((e: any) => e.availableQuantity < 5).length,
          activeCheckouts: checkouts.filter((c: any) => c.status === 'checked_out').length,
          totalReturned: checkouts.filter((c: any) => c.status === 'returned').length,
          overdueItems: checkouts.filter((c: any) => c.status === 'overdue').length,
          equipmentByCondition: {
            good: equipment.filter((e: any) => e.condition === 'good').length,
            fair: equipment.filter((e: any) => e.condition === 'fair').length,
            damaged: equipment.filter((e: any) => e.condition === 'damaged').length,
          },
        };

        setReportData(report);
      }
    } catch (error) {
      console.error('[v0] Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Inventory and checkout analytics</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading report data...</p>
        </div>
      ) : reportData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Total Equipment</p>
              <p className="text-3xl font-bold text-foreground mt-2">{reportData.totalEquipment}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-accent mt-2">{reportData.lowStockItems}</p>
              <p className="text-xs text-muted-foreground mt-2">Less than 5 units</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Active Checkouts</p>
              <p className="text-3xl font-bold text-primary mt-2">{reportData.activeCheckouts}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Checkout Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Returned Items</span>
                  <span className="text-lg font-bold text-foreground">{reportData.totalReturned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overdue Items</span>
                  <span className="text-lg font-bold text-destructive">{reportData.overdueItems}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Equipment Condition</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Good Condition</span>
                  <span className="px-3 py-1 rounded bg-primary/20 text-primary text-sm font-semibold">
                    {reportData.equipmentByCondition.good}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fair Condition</span>
                  <span className="px-3 py-1 rounded bg-accent/20 text-accent text-sm font-semibold">
                    {reportData.equipmentByCondition.fair}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Damaged</span>
                  <span className="px-3 py-1 rounded bg-destructive/20 text-destructive text-sm font-semibold">
                    {reportData.equipmentByCondition.damaged}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-foreground">
                • {reportData.lowStockItems > 0
                  ? `${reportData.lowStockItems} equipment item(s) have low stock levels`
                  : 'All equipment has sufficient stock levels'}
              </li>
              <li className="text-foreground">
                • {reportData.activeCheckouts} equipment item(s) currently checked out
              </li>
              <li className="text-foreground">
                • {reportData.overdueItems > 0
                  ? `⚠️ ${reportData.overdueItems} overdue item(s) require attention`
                  : 'No overdue items'}
              </li>
              <li className="text-foreground">
                • {Math.round(
                  (reportData.equipmentByCondition.good / reportData.totalEquipment) * 100
                )}% of equipment is in good condition
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load report data</p>
        </div>
      )}
    </div>
  );
}
