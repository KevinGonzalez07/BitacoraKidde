'use client';
// src/app/admin/records/[id]/edit/page.tsx
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShipmentFormData, LICENSE_TYPES } from '@/types';

export default function EditShipmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ShipmentFormData>({
    companyName: '',
    matricula: '',
    licenseType: '',
    arrivalTime: '',
    departureTime: '',
    arrivalDate: '',
    departureDate: '',
  });

  useEffect(() => {
    fetch(`/api/shipments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const s = data.shipment;
        setForm({
          companyName: s.companyName,
          matricula: s.matricula,
          licenseType: s.licenseType,
          arrivalTime: s.arrivalTime,
          departureTime: s.departureTime || '',
          arrivalDate: new Date(s.arrivalDate).toISOString().split('T')[0],
          departureDate: s.departureDate
            ? new Date(s.departureDate).toISOString().split('T')[0]
            : '',
        });
        setLoading(false);
      })
      .catch(() => { setError('Error al cargar el registro.'); setLoading(false); });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al guardar');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-8 h-8 text-kidde-red" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div>
          <h1 className="text-2xl font-black text-kidde-black">Editar Embarque</h1>
          <p className="text-sm text-kidde-gray-dark">ID: {id}</p>
        </div>
      </div>

      <div className="card overflow-hidden max-w-2xl">
        <div className="h-1 bg-kidde-red" />
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Empresa *</label>
              <input name="companyName" type="text" className="input-field" value={form.companyName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Matrícula *</label>
              <input name="matricula" type="text" className="input-field uppercase" value={form.matricula} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="label">Tipo de Licencia *</label>
            <select name="licenseType" className="input-field" value={form.licenseType} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {LICENSE_TYPES.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>

          <div>
            <p className="text-xs font-bold text-kidde-red uppercase tracking-widest mb-3">Llegada</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha *</label>
                <input name="arrivalDate" type="date" className="input-field" value={form.arrivalDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Hora *</label>
                <input name="arrivalTime" type="time" className="input-field" value={form.arrivalTime} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Salida</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha</label>
                <input name="departureDate" type="date" className="input-field" value={form.departureDate} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Hora</label>
                <input name="departureTime" type="time" className="input-field" value={form.departureTime} onChange={handleChange} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-kidde-red px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
