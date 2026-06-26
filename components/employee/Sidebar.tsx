'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', href: '/employee/dashboard', icon: '📊' },
  { label: 'Checkout Equipment', href: '/employee/checkout', icon: '📦' },
  { label: 'My Checkouts', href: '/employee/checkouts', icon: '📝' },
  { label: 'History', href: '/employee/history', icon: '📋' },
];

export function EmployeeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 hidden md:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Lab Inventory</h1>
        <p className="text-xs text-sidebar-foreground/60">Employee Portal</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition',
              pathname === item.href
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
