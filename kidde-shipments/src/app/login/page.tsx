'use client';
// src/app/login/page.tsx
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        setLoading(false);
        return;
      }

      const session = await getSession();
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/guard');
      }
    } catch {
      setError('Error del servidor. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-kidde-red/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-kidde-red/5" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="card overflow-hidden">
          {/* Red top bar */}
          <div className="h-1.5 bg-kidde-red" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-3 mb-3">
                {/* Kidde K logo SVG inline */}
                <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10 L55 10 L55 52 L85 10 L110 10 L72 58 L110 110 L85 110 L55 68 L55 110 L20 110 Z" fill="#C8102E"/>
                  <path d="M38 75 Q38 85 48 85 Q58 85 58 75 L58 65 L38 65 Z" fill="#9B0C22"/>
                </svg>
                <span className="text-3xl font-black tracking-tight text-kidde-black">KIDDE</span>
              </div>
              <h1 className="text-lg font-semibold text-kidde-gray-dark">
                Control de Embarques
              </h1>
              <p className="text-sm text-gray-400 mt-1">Iniciar sesión en el sistema</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Correo Electrónico</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label">Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-kidde-red px-4 py-3 rounded-lg text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Ingresando...
                  </>
                ) : (
                  'Ingresar al Sistema'
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-kidde-gray-dark mb-2">CREDENCIALES DE PRUEBA</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><span className="font-medium text-kidde-black">Admin:</span> admin@kidde.com / admin123</p>
                <p><span className="font-medium text-kidde-black">Guardia:</span> guardia@kidde.com / guardia123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Kidde — Fire Safety Solutions
        </p>
      </div>
    </div>
  );
}
