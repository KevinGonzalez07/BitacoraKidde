// scripts/cron.ts
// Run this file with: npx ts-node scripts/cron.ts
// Or add to PM2/systemd for production.
import cron from 'node-cron';

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

// Runs every day at 23:59
cron.schedule('59 23 * * *', async () => {
  console.log(`[CRON] ${new Date().toISOString()} — Generando reporte diario...`);
  try {
    const res = await fetch(`${BASE_URL}/api/cron`, {
      headers: { 'x-cron-token': CRON_SECRET },
    });
    const data = await res.json();
    if (data.success) {
      console.log(`[CRON] ✅ Reporte generado: ${data.file}`);
    } else {
      console.error(`[CRON] ❌ Error: ${data.error}`);
    }
  } catch (err) {
    console.error('[CRON] Error al llamar endpoint:', err);
  }
}, {
  timezone: 'America/Matamoros',
});

console.log('[CRON] Servicio iniciado — Reporte diario a las 23:59');
