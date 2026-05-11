// src/app/guard/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { KiddeHeader } from '@/components/KiddeHeader';

export default async function GuardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');
  if (session.user.role !== 'GUARD') redirect('/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      <KiddeHeader user={session.user} />
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
