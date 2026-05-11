'use client';
// src/components/ShipmentsTable.tsx
import { useRouter } from 'next/navigation';
import { ShipmentWithGuard } from '@/types';

interface Props {
  shipments: ShipmentWithGuard[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function ShipmentsTable({ shipments, loading, onDelete }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20 text-kidde-gray-dark gap-3">
        <svg className="animate-spin w-6 h-6 text-kidde-red" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Cargando registros...
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
          </svg>
        </div>
        <p className="text-kidde-gray-dark font-medium">No hay registros</p>
        <p className="text-gray-400 text-sm mt-1">Los embarques aparecerán aquí cuando se registren.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Empresa', 'Matrícula', 'Licencia', 'Llegada', 'Salida', 'Guardia', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-kidde-gray-dark uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shipments.map((s) => {
              const hasLeft = !!s.departureTime;
              return (
                <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-kidde-black truncate max-w-[180px]">{s.companyName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {s.matricula}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-kidde-gray-dark">{s.licenseType}</td>
                  <td className="px-4 py-3">
                    <p className="text-kidde-black">{new Date(s.arrivalDate).toLocaleDateString('es-MX')}</p>
                    <p className="text-xs text-kidde-gray-dark">{s.arrivalTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    {s.departureDate ? (
                      <>
                        <p className="text-kidde-black">{new Date(s.departureDate).toLocaleDateString('es-MX')}</p>
                        <p className="text-xs text-kidde-gray-dark">{s.departureTime}</p>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-kidde-gray-dark">{s.guard.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      hasLeft
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${hasLeft ? 'bg-gray-400' : 'bg-green-500'}`} />
                      {hasLeft ? 'Salió' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/admin/records/${s.id}/edit`)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="p-1.5 hover:bg-red-50 text-kidde-red rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p className="text-xs text-kidde-gray-dark">
          Mostrando <span className="font-semibold text-kidde-black">{shipments.length}</span> registros
        </p>
        <p className="text-xs text-gray-400">
          Última actualización: {new Date().toLocaleTimeString('es-MX')}
        </p>
      </div>
    </div>
  );
}
