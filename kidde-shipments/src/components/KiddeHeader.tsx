'use client';
// src/components/KiddeHeader.tsx
import { signOut } from 'next-auth/react';

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
  isAdmin?: boolean;
}

export function KiddeHeader({ user, isAdmin }: Props) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Red bar on top */}
      <div className="h-1 bg-kidde-red" />
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10 L55 10 L55 52 L85 10 L110 10 L72 58 L110 110 L85 110 L55 68 L55 110 L20 110 Z" fill="#C8102E"/>
            <path d="M38 75 Q38 85 48 85 Q58 85 58 75 L58 65 L38 65 Z" fill="#9B0C22"/>
          </svg>
          <div>
            <span className="text-xl font-black tracking-tight text-kidde-black">KIDDE</span>
            <span className="text-xs text-kidde-gray-dark ml-2 hidden sm:inline">
              {isAdmin ? 'Panel Administrativo' : 'Control de Embarques'}
            </span>
          </div>
        </div>

        {/* User info & logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-kidde-red' : 'bg-green-500'}`} />
            <span className="text-sm text-kidde-gray-dark">
              {user.name}
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-red-50 text-kidde-red'
                  : 'bg-green-50 text-green-700'
              }`}>
                {isAdmin ? 'ADMIN' : 'GUARDIA'}
              </span>
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 text-sm text-kidde-gray-dark hover:text-kidde-red transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
