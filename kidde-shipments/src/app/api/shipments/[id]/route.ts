// src/app/api/shipments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: { guard: { select: { name: true, email: true } } },
  });

  if (!shipment) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json({ shipment });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { companyName, matricula, licenseType, arrivalTime, departureTime, arrivalDate, departureDate } = body;

  if (!companyName || !matricula || !licenseType || !arrivalTime || !arrivalDate) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const shipment = await prisma.shipment.update({
    where: { id: params.id },
    data: {
      companyName: companyName.trim(),
      matricula: matricula.trim().toUpperCase(),
      licenseType,
      arrivalTime,
      departureTime: departureTime || null,
      arrivalDate: new Date(arrivalDate),
      departureDate: departureDate ? new Date(departureDate) : null,
    },
  });

  return NextResponse.json({ shipment });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.shipment.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
