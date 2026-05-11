// src/app/api/cron/route.ts
// This endpoint is called by a cron job or external scheduler at 11:59 PM daily.
// To run it with Node-Cron, create a standalone script (see scripts/cron.ts).
import { NextRequest, NextResponse } from 'next/server';
import { generateShipmentsExcel } from '@/lib/excel';

export async function GET(req: NextRequest) {
  // Protect with a secret token in production
  const token = req.headers.get('x-cron-token');
  if (process.env.NODE_ENV === 'production' && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filepath = await generateShipmentsExcel();
    return NextResponse.json({ success: true, file: filepath });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
