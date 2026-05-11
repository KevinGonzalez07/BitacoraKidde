// src/app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  const where: any = {};

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { matricula: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (dateFrom || dateTo) {
    where.arrivalDate = {};
    if (dateFrom) where.arrivalDate.gte = new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59);
      where.arrivalDate.lte = to;
    }
  }

  const shipments = await prisma.shipment.findMany({
    where,
    include: { guard: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ shipments });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { companyName, matricula, licenseType, arrivalTime, departureTime, arrivalDate, departureDate } = body;

  if (!companyName || !matricula || !licenseType || !arrivalTime || !arrivalDate) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const shipment = await prisma.shipment.create({
    data: {
      companyName: companyName.trim(),
      matricula: matricula.trim().toUpperCase(),
      licenseType,
      arrivalTime,
      departureTime: departureTime || null,
      arrivalDate: new Date(arrivalDate),
      departureDate: departureDate ? new Date(departureDate) : null,
      guardId: session.user.id,
    },
  });

  return NextResponse.json({ shipment }, { status: 201 });
}
