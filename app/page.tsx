import Link from 'next/link';

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Lab Inventory Manager</h1>
        <p className="text-lg text-muted-foreground mb-6">Welcome — use the demo credentials to try the app.</p>

        <div className="flex gap-4 justify-center">
          <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Sign in</Link>
          <Link href="/register" className="px-4 py-2 bg-card border border-border rounded-md">Register</Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p className="mb-1">Demo Admin: <strong>admin01 / password123</strong></p>
          <p>Employee demo: <strong>emp001 / password123</strong></p>
        </div>
      </div>
    </main>
  );
}
