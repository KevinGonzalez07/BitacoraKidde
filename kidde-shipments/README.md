# Kidde — Sistema de Control de Embarques

Sistema web para registro y control de embarques diarios con roles de guardia y administrador.
**Base de datos:** Supabase (PostgreSQL administrado).

---

## 🚀 Instalación paso a paso

### 1. Instalar dependencias
```bash
npm install
```

---

### 2. Crear proyecto en Supabase

1. Ir a https://supabase.com → **New project**
2. Anotar la contraseña que eliges (la necesitarás en el siguiente paso)
3. Esperar a que el proyecto termine de crearse (~1 min)

---

### 3. Obtener las cadenas de conexión

En el dashboard de Supabase: **Settings → Database → Connection string**

Necesitas **dos** URIs:

| Modo | Puerto | Para qué |
|---|---|---|
| **Transaction pooler** | 6543 | `DATABASE_URL` — uso en runtime/Next.js |
| **Session mode** | 5432 | `DIRECT_URL` — migraciones y seed |

Ambas tienen el formato:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:[PORT]/postgres
```

---

### 4. Configurar `.env`

```bash
cp .env.example .env
```

Editar `.env` con tus valores reales:

```env
# Transaction pooler — puerto 6543 (para Next.js en runtime)
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=10"

# Conexión directa — puerto 5432 (para db:push y seed)
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-con: openssl rand -base64 32"
CRON_SECRET="otro-secreto-seguro"
```

> ⚠️ Reemplaza `xxxxxxxxxxxx` con tu Project Reference y `TU_PASSWORD` con la contraseña que elegiste al crear el proyecto.

---

### 5. Aplicar schema y poblar la BD

```bash
# Crea las tablas en Supabase
npm run db:push

# Crea los usuarios iniciales (admin y guardia)
npm run db:seed
```

---

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir: http://localhost:3000

---

## 👤 Credenciales iniciales

| Rol     | Email               | Contraseña  |
|---------|---------------------|-------------|
| ADMIN   | admin@kidde.com     | admin123    |
| GUARDIA | guardia@kidde.com   | guardia123  |

> ⚠️ Cambia estas contraseñas en producción.

---

## 📁 Estructura del proyecto

```
kidde-shipments/
├── prisma/
│   ├── schema.prisma       # Modelos (User, Shipment)
│   └── seed.ts             # Usuarios iniciales
├── scripts/
│   └── cron.ts             # Cron job autónomo (node-cron)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # NextAuth
│   │   │   ├── shipments/  # CRUD embarques
│   │   │   ├── export/     # Exportar Excel
│   │   │   └── cron/       # Endpoint del cron
│   │   ├── login/          # Página de login
│   │   ├── guard/          # Vista del guardia
│   │   └── admin/          # Dashboard admin + edición
│   ├── components/
│   │   ├── KiddeHeader.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── ShipmentsTable.tsx
│   │   └── AuthProvider.tsx
│   ├── lib/
│   │   ├── prisma.ts       # Cliente Prisma singleton
│   │   ├── auth.ts         # Configuración NextAuth
│   │   └── excel.ts        # Generador Excel (ExcelJS)
│   └── types/index.ts
└── public/reports/         # Excel generados automáticamente
```

---

## ⏰ Cron Job — Reporte automático diario

Genera un Excel con todos los registros cada día a las **23:59** (zona horaria Matamoros).

**Opción A — Script standalone:**
```bash
npx ts-node scripts/cron.ts
```

**Opción B — Crontab del sistema:**
```bash
59 23 * * * curl -H "x-cron-token: TU_CRON_SECRET" http://localhost:3000/api/cron
```

Los archivos se guardan en `/public/reports/`.

---

## 🏗️ Producción (Vercel + Supabase)

Supabase + Vercel es la combinación más sencilla:

1. Push del repo a GitHub
2. Importar en Vercel
3. Agregar las variables de entorno en **Vercel → Settings → Environment Variables**
4. Deploy automático ✅

Para el cron en producción usa **Vercel Cron Jobs** o **GitHub Actions**.

---

## 🛠️ Scripts disponibles

| Comando             | Descripción                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Servidor de desarrollo               |
| `npm run build`     | Build de producción                  |
| `npm run db:push`   | Aplicar schema a Supabase            |
| `npm run db:seed`   | Crear usuarios iniciales             |
| `npm run db:studio` | Abrir Prisma Studio (explorador BD)  |
