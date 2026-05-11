'use client';
// src/components/AdminSidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/admin',
    label: 'Embarques',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 shrink-0 hidden md:block">
      <nav className="p-4 space-y-1 pt-6">
        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest px-3 mb-3">Menú</p>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-kidde-red text-white'
                  : 'text-kidde-gray-dark hover:bg-gray-50 hover:text-kidde-black'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom badge */}
      <div className="absolute bottom-6 left-4 right-4 hidden md:block">
        <div className="bg-kidde-red/5 border border-kidde-red/10 rounded-lg p-3 text-center">
          <p className="text-xs font-bold text-kidde-red">KIDDE</p>
          <p className="text-xs text-gray-400 mt-0.5">Fire Safety System</p>
        </div>
      </div>
    </aside>
  );
}
