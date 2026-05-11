// src/app/admin/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { KiddeHeader } from '@/components/KiddeHeader';
import { AdminSidebar } from '@/components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/guard');

  return (
    <div className="min-h-screen bg-gray-50">
      <KiddeHeader user={session.user} isAdmin />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
