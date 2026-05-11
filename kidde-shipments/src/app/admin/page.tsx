'use client';
// src/app/admin/page.tsx
import { useEffect, useState, useCallback } from 'react';
import { ShipmentWithGuard } from '@/types';
import { ShipmentsTable } from '@/components/ShipmentsTable';

export default function AdminPage() {
  const [shipments, setShipments] = useState<ShipmentWithGuard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const res = await fetch(`/api/shipments?${params.toString()}`);
    const data = await res.json();
    setShipments(data.shipments || []);
    setLoading(false);
  }, [search, dateFrom, dateTo]);

  useEffect(() => {
    const t = setTimeout(fetchShipments, 300);
    return () => clearTimeout(t);
  }, [fetchShipments]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return;
    await fetch(`/api/shipments/${id}`, { method: 'DELETE' });
    fetchShipments();
  };

  const handleDownload = async () => {
    setDownloading(true);
    const res = await fetch('/api/export');
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `embarques_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    setDownloading(false);
  };

  const stats = {
    total: shipments.length,
    today: shipments.filter(s => {
      const d = new Date(s.arrivalDate);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    }).length,
    active: shipments.filter(s => !s.departureTime).length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-kidde-black">Dashboard de Embarques</h1>
        <p className="text-kidde-gray-dark mt-1">Historial completo de registros del sistema.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Registros', value: stats.total, icon: '📦', color: 'text-kidde-black' },
          { label: 'Hoy', value: stats.today, icon: '📅', color: 'text-blue-600' },
          { label: 'Sin Salida', value: stats.active, icon: '⏳', color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-kidde-gray-dark mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="card p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <input
              type="text"
              placeholder="Buscar por empresa o matrícula..."
              className="input-field max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="input-field w-40"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="Desde"
              />
              <input
                type="date"
                className="input-field w-40"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="Hasta"
              />
            </div>
            {(search || dateFrom || dateTo) && (
              <button
                onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
                className="btn-secondary text-sm px-3 py-2"
              >
                Limpiar
              </button>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            {downloading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            )}
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <ShipmentsTable
        shipments={shipments}
        loading={loading}
        onDelete={handleDelete}
        onRefresh={fetchShipments}
      />
    </div>
  );
}
