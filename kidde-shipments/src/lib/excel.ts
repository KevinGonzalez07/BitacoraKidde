// src/lib/excel.ts
import ExcelJS from 'exceljs';
import { prisma } from './prisma';
import path from 'path';
import fs from 'fs';

export async function generateShipmentsExcel(): Promise<string> {
  const shipments = await prisma.shipment.findMany({
    include: { guard: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kidde Sistema de Embarques';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Embarques', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  // Header row styling
  sheet.columns = [
    { header: 'ID', key: 'id', width: 20 },
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

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC8102E' },
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF9B0C22' } },
    };
  });
  headerRow.height = 28;

  // Add data
  shipments.forEach((s, index) => {
    const row = sheet.addRow({
      id: s.id,
      companyName: s.companyName,
      matricula: s.matricula,
      licenseType: s.licenseType,
      arrivalDate: new Date(s.arrivalDate).toLocaleDateString('es-MX'),
      arrivalTime: s.arrivalTime,
      departureDate: s.departureDate
        ? new Date(s.departureDate).toLocaleDateString('es-MX')
        : '—',
      departureTime: s.departureTime || '—',
      guardName: s.guard.name,
      createdAt: new Date(s.createdAt).toLocaleString('es-MX'),
    });

    // Alternate row colors
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFAFAFA' },
        };
      });
    }

    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });
    row.height = 22;
  });

  // Freeze top row
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Auto-filter
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 10 },
  };

  // Save file
  const outputDir = path.join(process.cwd(), 'public', 'reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `embarques_historial_${new Date().toISOString().split('T')[0]}.xlsx`;
  const filepath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(filepath);

  return filepath;
}
