'use client';
// src/app/guard/page.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ShipmentFormData, LICENSE_TYPES } from '@/types';

export default function GuardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ShipmentFormData>({
    companyName: '',
    matricula: '',
    licenseType: '',
    arrivalTime: '',
    departureTime: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    departureDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al registrar embarque');
      }

      setSuccess(true);
      setForm({
        companyName: '',
        matricula: '',
        licenseType: '',
        arrivalTime: '',
        departureTime: '',
        arrivalDate: new Date().toISOString().split('T')[0],
        departureDate: '',
      });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-kidde-red rounded-full flex items-center justify-center text-white font-bold text-lg">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-kidde-black">
              Bienvenido, {session?.user?.name}
            </h1>
            <p className="text-sm text-kidde-gray-dark capitalize">{today}</p>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {success && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="font-semibold">¡Embarque registrado exitosamente!</p>
            <p className="text-sm opacity-75">El registro fue guardado en la base de datos.</p>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="card overflow-hidden">
        <div className="h-1 bg-kidde-red" />
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-kidde-black flex items-center gap-2">
            <svg className="w-5 h-5 text-kidde-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Registro de Embarque
          </h2>
          <p className="text-sm text-kidde-gray-dark mt-1">
            Complete todos los campos requeridos (*) para registrar el embarque.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company & Matricula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre de la Empresa *</label>
              <input
                name="companyName"
                type="text"
                className="input-field"
                placeholder="Ej: Transportes México SA"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Matrícula *</label>
              <input
                name="matricula"
                type="text"
                className="input-field uppercase"
                placeholder="Ej: ABC-1234"
                value={form.matricula}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* License type */}
          <div>
            <label className="label">Tipo de Licencia *</label>
            <select
              name="licenseType"
              className="input-field"
              value={form.licenseType}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo de licencia...</option>
              {LICENSE_TYPES.map((lt) => (
                <option key={lt} value={lt}>{lt}</option>
              ))}
            </select>
          </div>

          {/* Arrival section */}
          <div>
            <p className="text-xs font-bold text-kidde-red uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-kidde-red inline-block" />
              Llegada
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha de Llegada *</label>
                <input
                  name="arrivalDate"
                  type="date"
                  className="input-field"
                  value={form.arrivalDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">Hora de Llegada *</label>
                <input
                  name="arrivalTime"
                  type="time"
                  className="input-field"
                  value={form.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Departure section */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gray-300 inline-block" />
              Salida (opcional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha de Salida</label>
                <input
                  name="departureDate"
                  type="date"
                  className="input-field"
                  value={form.departureDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Hora de Salida</label>
                <input
                  name="departureTime"
                  type="time"
                  className="input-field"
                  value={form.departureTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-kidde-red px-4 py-3 rounded-lg text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Guardia: <span className="font-medium text-kidde-gray-dark">{session?.user?.name}</span>
            </p>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  Registrar Embarque
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
