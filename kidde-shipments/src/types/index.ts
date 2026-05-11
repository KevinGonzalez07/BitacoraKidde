// src/types/index.ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

export interface ShipmentWithGuard {
  id: string;
  companyName: string;
  matricula: string;
  licenseType: string;
  arrivalTime: string;
  departureTime: string | null;
  arrivalDate: Date;
  departureDate: Date | null;
  guardId: string;
  createdAt: Date;
  updatedAt: Date;
  guard: {
    name: string;
    email: string;
  };
}

export interface ShipmentFormData {
  companyName: string;
  matricula: string;
  licenseType: string;
  arrivalTime: string;
  departureTime?: string;
  arrivalDate: string;
  departureDate?: string;
}

export const LICENSE_TYPES = [
  'Licencia A',
  'Licencia B',
  'Licencia C',
  'Licencia D',
  'Licencia E',
  'Chofer Particular',
  'Operador Especial',
];
