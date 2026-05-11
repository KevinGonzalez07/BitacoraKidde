// src/app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  const where: any = {};
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
    include: { guard: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kidde Sistema de Embarques';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Embarques', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  sheet.columns = [
    { header: 'ID', key: 'id', width: 22 },
    { header: 'Empresa', key: 'companyName', width: 28 },
    { header: 'Matrícula', key: 'matricula', width: 18 },
    { header: 'Tipo de Licencia', key: 'licenseType', width: 20 },
    { header: 'Fecha Llegada', key: 'arrivalDate', width: 18 },
    { header: 'Hora Llegada', key: 'arrivalTime', width: 16 },
    { header: 'Fecha Salida', key: 'departureDate', width: 18 },
    { header: 'Hora Salida', key: 'departureTime', width: 16 },
    { header: 'Guardia', key: 'guardName', width: 22 },
    { header: 'Registrado', key: 'createdAt', width: 22 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8102E' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  headerRow.height = 28;

  shipments.forEach((s, index) => {
    const row = sheet.addRow({
      id: s.id,
      companyName: s.companyName,
      matricula: s.matricula,
      licenseType: s.licenseType,
      arrivalDate: new Date(s.arrivalDate).toLocaleDateString('es-MX'),
      arrivalTime: s.arrivalTime,
      departureDate: s.departureDate ? new Date(s.departureDate).toLocaleDateString('es-MX') : '—',
      departureTime: s.departureTime || '—',
      guardName: s.guard.name,
      createdAt: new Date(s.createdAt).toLocaleString('es-MX'),
    });

    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFAFA' } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });
    row.height = 22;
  });

  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 10 } };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="embarques_${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}
